"""
sistema_experto_notas_robusto.py
CLI para sistema experto de diagnósticos académicos (nota).
- Carga KB JSON (por defecto kb_notas.json).
- Modo interactivo (--nota) o por archivo CSV (--csv --out).
- Explicaciones legibles (--explain).
"""
import argparse
import csv
import json
import os
from typing import Dict, Any

from engine_expert import KnowledgeBase, ExpertSystem

def validar_nota(n: float, scale: Dict[str, float]) -> float:
    try:
        n = float(n)
    except (TypeError, ValueError):
        raise ValueError("La nota debe ser numérica.")
    lo = float(scale.get("min", 0.0))
    hi = float(scale.get("max", 5.0))
    if not (lo <= n <= hi):
        raise ValueError(f"La nota debe estar entre {lo} y {hi}.")
    return n

def correr_uno(nota: float, kb_path: str, explain: bool = True) -> str:
    kb = KnowledgeBase.from_json_file(kb_path)
    es = ExpertSystem(kb)
    nota = validar_nota(nota, kb.config.get("scale", {"min": 0.0, "max": 5.0}))
    hechos = {"nota": nota}
    res = es.infer(hechos)
    salida = [
        "=== RESULTADO ===",
        f"Nota: {nota:.2f}",
        f"Diagnóstico: {res.facts.get('diagnostico', 'Sin diagnóstico')}",
        f"Regla: {res.facts.get('regla', 'N/A')}",
        f"Confianza: {res.facts.get('cf', 0.0):.2f}"
    ]
    if explain:
        salida.append("")
        salida.append(ExpertSystem.explain(res))
    return "\n".join(salida)

def correr_csv(in_path: str, out_path: str, kb_path: str, explain: bool = False) -> None:
    kb = KnowledgeBase.from_json_file(kb_path)
    es = ExpertSystem(kb)
    scale = kb.config.get("scale", {"min": 0.0, "max": 5.0})

    with open(in_path, newline="", encoding="utf-8") as fin, open(out_path, "w", newline="", encoding="utf-8") as fout:
        reader = csv.DictReader(fin)
        fieldnames = list(reader.fieldnames or [])
        if "nota" not in fieldnames:
            raise ValueError("El CSV debe tener una columna llamada 'nota'.")
        # columnas de salida adicionales
        extras = ["diagnostico", "regla", "cf"]
        fieldnames_out = fieldnames + [c for c in extras if c not in fieldnames]
        writer = csv.DictWriter(fout, fieldnames=fieldnames_out)
        writer.writeheader()
        for row in reader:
            try:
                nota = validar_nota(row["nota"], scale)
                hechos = {"nota": nota}
                res = es.infer(hechos)
                row["diagnostico"] = res.facts.get("diagnostico", "")
                row["regla"] = res.facts.get("regla", "")
                row["cf"] = f"{res.facts.get('cf', 0.0):.2f}"
            except Exception as e:
                row["diagnostico"] = f"ERROR: {e}"
                row["regla"] = ""
                row["cf"] = ""
            writer.writerow(row)

def main():
    parser = argparse.ArgumentParser(description="Sistema Experto de Diagnóstico Académico")
    parser.add_argument("--kb", default="kb_notas.json", help="Ruta al archivo de conocimiento (JSON).")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--nota", type=float, help="Valor de nota (ej: 3.7).")
    group.add_argument("--csv", help="Ruta a archivo CSV de entrada con columna 'nota'.")
    parser.add_argument("--out", help="Ruta de salida CSV si usas --csv (opcional).")
    parser.add_argument("--explain", action="store_true", help="Muestra explicación detallada.")
    args = parser.parse_args()

    kb_path = args.kb
    if not os.path.exists(kb_path):
        raise SystemExit(f"No se encontró la KB en: {kb_path}")

    if args.nota is not None:
        print(correr_uno(args.nota, kb_path, explain=args.explain))
    else:
        out_path = args.out or "salida_diagnosticos.csv"
        correr_csv(args.csv, out_path, kb_path, explain=args.explain)
        print(f"Procesado CSV. Salida escrita en: {out_path}")

if __name__ == "__main__":
    main()
