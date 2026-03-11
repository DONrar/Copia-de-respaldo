import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DiagnosisRequest, DiagnosisResponse, QuestionDTO,  } from '../../../core/models/expert.model';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-wizard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss'
})
export class WizardComponent {
   private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  domain = signal<string>('');
  questions = signal<QuestionDTO[]>([]);
  loaded = signal(false);
  index = signal(0);
  answers = signal<Map<number, string>>(new Map());
  result = signal<DiagnosisResponse | null>(null);
  withTrace = false;

  // computed properties
  total = computed(() => this.questions().length);
  currentQ = computed(() => this.questions()[this.index()] ?? null);
  progressPct = computed(() => this.total() ? ((this.index() + 1) / this.total()) * 100 : 0);
  certaintyPct = computed(() => (this.result()?.certainty ?? 0) * 100);
  hasTrace = computed(() => (this.result()?.trace?.length ?? 0) > 0);

  // Color según nivel de certeza
  certaintyColor = computed(() => {
    const cf = this.result()?.certainty ?? 0;
    if (cf < 0.4) return '#ef4444';   // rojo
    if (cf < 0.7) return '#facc15';   // amarillo
    return '#22c55e';                 // verde
  });

  constructor() {
    effect(() => {
      const d = this.route.snapshot.paramMap.get('domain') ?? '';
      if (!d) return;
      this.domain.set(d.toUpperCase());
      this.loadQuestions(this.domain());
    });
  }

  private loadQuestions(code: string) {
    this.loaded.set(false);
    this.api.getQuestions(code).subscribe({
      next: qs => {
        this.questions.set(qs);
        this.index.set(0);
        this.answers.set(new Map());
        this.result.set(null);
        this.loaded.set(true);
      },
      error: _ => {
        this.questions.set([]);
        this.loaded.set(true);
      }
    });
  }

  // === Navegación ===
  isSelected(value: string): boolean {
    const q = this.currentQ();
    return !!q && this.answers().get(q.id) === value;
  }

  hasAnswerFor(qid?: number | null): boolean {
    if (!qid) return false;
    return this.answers().has(qid);
  }

  selectOption(value: string) {
    const q = this.currentQ();
    if (!q) return;
    const map = new Map(this.answers());
    map.set(q.id, value);
    this.answers.set(map);
  }

  next() { if (this.index() < this.total() - 1) this.index.update(v => v + 1); }
  prev() { if (this.index() > 0) this.index.update(v => v - 1); }

  allAnswered(): boolean {
    return this.questions().every(q => this.answers().has(q.id));
  }

  // === Acciones ===
  submit() {
    const payload: DiagnosisRequest = {
      domainCode: this.domain(),
      answers: this.questions().map(q => ({
        questionId: q.id,
        optionValue: this.answers().get(q.id) || ''
      }))
    };

    this.api.diagnose(payload, this.withTrace).subscribe({
      next: (res) => this.result.set(res),
      error: _ => this.result.set({
        domainCode: this.domain(),
        ruleMatched: 'ERROR',
        diagnosis: 'No fue posible obtener diagnóstico. Intenta nuevamente.',
        certainty: 0,
        trace: []
      })
    });
  }

  restart() {
    this.index.set(0);
    this.answers.set(new Map());
    this.result.set(null);
    this.withTrace = false;
  }
}
