"""
engine_expert.py
Motor de sistemas expertos (reglas declarativas) con:
- Evaluación segura de condiciones (AST restringido).
- Resolución de conflictos por prioridad y especificidad.
- Factores de certeza (CF) y trazabilidad de reglas disparadas.
- Carga de KB en JSON.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple
import json
import ast
import operator

# -----------------------------
# Evaluador seguro de expresiones
# -----------------------------

_ALLOWED_BIN_OPS = {
    ast.Lt: operator.lt,
    ast.LtE: operator.le,
    ast.Gt: operator.gt,
    ast.GtE: operator.ge,
    ast.Eq: operator.eq,
    ast.NotEq: operator.ne,
    # No incluimos "In" ni "NotIn" para mantenerlo sencillo/seguro
}

class SafeEval(ast.NodeVisitor):
    """
    Evalúa expresiones booleanas simples de forma segura.
    Permitidos: and, or, not, comparaciones (<, <=, >, >=, ==, !=), nombres y constantes.
    """
    def __init__(self, context: Dict[str, Any]):
        self.ctx = context

    def visit(self, node):
        allowed = (ast.Expression, ast.BoolOp, ast.UnaryOp, ast.Compare, ast.Name, ast.Constant)
        if not isinstance(node, allowed):
            raise ValueError(f"Expresión no permitida: {type(node).__name__}")
        return super().visit(node)

    def visit_Expression(self, node: ast.Expression):
        return self.visit(node.body)

    def visit_BoolOp(self, node: ast.BoolOp):
        values = [self.visit(v) for v in node.values]
        if isinstance(node.op, ast.And):
            return all(values)
        elif isinstance(node.op, ast.Or):
            return any(values)
        else:
            raise ValueError("Operador booleano no permitido")

    def visit_UnaryOp(self, node: ast.UnaryOp):
        if isinstance(node.op, ast.Not):
            return not self.visit(node.operand)
        raise ValueError("Operador unario no permitido")

    def visit_Compare(self, node: ast.Compare):
        left = self.visit(node.left)
        result = True
        for op, comp in zip(node.ops, node.comparators):
            right = self.visit(comp)
            op_type = type(op)
            if op_type not in _ALLOWED_BIN_OPS:
                raise ValueError(f"Operador de comparación no permitido: {op_type.__name__}")
            result = result and _ALLOWED_BIN_OPS[op_type](left, right)
            left = right
        return result

    def visit_Name(self, node: ast.Name):
        # Solo lectura del contexto
        return self.ctx.get(node.id, None)

    def visit_Constant(self, node: ast.Constant):
        return node.value

def safe_eval_bool(expr: str, context: Dict[str, Any]) -> bool:
    tree = ast.parse(expr, mode="eval")
    return bool(SafeEval(context).visit(tree))

def expr_specificity(expr: str) -> int:
    """
    Métrica simple de "especificidad": número de comparaciones en la expresión.
    Más comparaciones => regla más específica.
    """
    tree = ast.parse(expr, mode="eval")
    class C(ast.NodeVisitor):
        def __init__(self): self.c = 0
        def visit_Compare(self, node): 
            # Una comparación con n ops cuenta n (ej: a < b < c son 2)
            self.c += max(1, len(node.ops))
            self.generic_visit(node)
    c = C(); c.visit(tree)
    return c.c

# -----------------------------
# Datos, reglas y KB
# -----------------------------

@dataclass
class Rule:
    name: str
    when: str  # expresión booleana segura
    message: str
    cf: float = 1.0  # factor de certeza [0,1]
    salience: int = 0  # prioridad
    tags: List[str] = field(default_factory=list)

    # Métrica precalculada para desempate (opcional)
    specificity: int = field(init=False)

    def __post_init__(self):
        self.specificity = expr_specificity(self.when)

@dataclass
class FireRecord:
    rule: Rule
    matched: bool
    reason: Optional[str] = None

@dataclass
class InferenceResult:
    facts: Dict[str, Any]
    fired: List[FireRecord]
    chosen: Optional[Rule] = None
    confidence: Optional[float] = None

class KnowledgeBase:
    def __init__(self, rules: List[Rule], config: Optional[Dict[str, Any]] = None):
        self.rules = rules
        self.config = config or {}

    @staticmethod
    def from_json_file(path: str) -> "KnowledgeBase":
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        rules = [Rule(
            name=r["name"],
            when=r["when"],
            message=r["then"]["message"],
            cf=r.get("cf", 1.0),
            salience=r.get("salience", 0),
            tags=r.get("tags", []),
        ) for r in data.get("rules", [])]
        return KnowledgeBase(rules, data.get("config", {}))

# -----------------------------
# Motor de inferencia
# -----------------------------

class ExpertSystem:
    def __init__(self, kb: KnowledgeBase, strategy: str = "priority_specificity", combine: str = "max"):
        """
        strategy: 
            - 'first_match' (por orden en KB),
            - 'priority_specificity' (salience desc, specificity desc, nombre asc)
        combine: 
            - 'max' (toma el CF mayor entre reglas que aplican),
            - 'prob_or' (1 - Π(1 - cf)) si se permitiera disparar múltiples reglas.
        """
        self.kb = kb
        self.strategy = strategy or kb.config.get("conflict_resolution", "priority_specificity")
        self.combine = combine or kb.config.get("combine", "max")

    def _sort_rules(self, rules: List[Rule]) -> List[Rule]:
        if self.strategy == "first_match":
            return rules[:]  # tal cual en KB
        return sorted(rules, key=lambda r: (-r.salience, -r.specificity, r.name))

    def infer(self, facts: Dict[str, Any]) -> InferenceResult:
        fired_records: List[FireRecord] = []
        applicable: List[Rule] = []
        for rule in self._sort_rules(self.kb.rules):
            try:
                matched = safe_eval_bool(rule.when, facts)
                fired_records.append(FireRecord(rule=rule, matched=matched, reason=("OK" if matched else "No cumple condición")))
                if matched:
                    applicable.append(rule)
            except Exception as e:
                fired_records.append(FireRecord(rule=rule, matched=False, reason=f"Error en condición: {e}"))

        chosen: Optional[Rule] = None
        confidence: Optional[float] = None

        if not applicable:
            return InferenceResult(facts=facts, fired=fired_records, chosen=None, confidence=None)

        if self.strategy == "first_match":
            chosen = applicable[0]
        else:
            # Dado que ya están ordenadas por salience/specificity, tomamos la primera
            chosen = applicable[0]

        # Combinar CF (si se permitiera más de una acción). Aquí usamos 'max'.
        if self.combine == "prob_or":
            import math
            p = 1.0
            for r in applicable:
                p *= (1.0 - r.cf)
            confidence = 1.0 - p
        else:
            confidence = max(r.cf for r in applicable)

        # Acción: escribir diagnósticos (idempotente)
        facts["diagnostico"] = chosen.message
        facts["regla"] = chosen.name
        facts["cf"] = confidence

        return InferenceResult(facts=facts, fired=fired_records, chosen=chosen, confidence=confidence)

    @staticmethod
    def explain(result: InferenceResult) -> str:
        lines: List[str] = []
        lines.append("=== EXPLICACIÓN ===")
        if result.chosen is None:
            lines.append("No se disparó ninguna regla.")
            for fr in result.fired:
                lines.append(f"- {fr.rule.name}: {fr.reason}")
            return "\n".join(lines)

        lines.append(f"Regla seleccionada: {result.chosen.name} (salience={result.chosen.salience}, "
                     f"specificity={result.chosen.specificity}, cf={result.chosen.cf:.2f})")
        lines.append(f"Mensaje: {result.chosen.message}")
        if result.confidence is not None:
            lines.append(f"Confianza combinada: {result.confidence:.2f}")
        lines.append("Detalle de evaluación de reglas:")
        for fr in result.fired:
            mark = "✔" if fr.matched else "—"
            lines.append(f"  {mark} {fr.rule.name}  WHEN: {fr.rule.when}  -> {fr.reason}")
        return "\n".join(lines)
