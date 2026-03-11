import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton,
  IonNote, IonSelect, IonSelectOption, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DebtorRepo } from '../../domain/repos/debtor.repo';
import { DebtRepo } from '../../domain/repos/debt.repo';
import { Debtor } from '../../domain/models';
import { calcItemTotal } from '../../domain/totals.util';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-debt-new',
  templateUrl: './debt-new.page.html',
  styleUrls: ['./debt-new.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,  CommonModule, ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton,
    IonNote, IonSelect, IonSelectOption, IonButtons, IonBackButton]
})
export class DebtNewPage implements OnInit, OnDestroy {
  debtors = signal<Debtor[]>([]);
  form = this.fb.group({
    debtorId: ['', Validators.required],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    note: [''],
    items: this.fb.array<FormGroup>([])
  });

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private debtorRepo: DebtorRepo,
    private debtRepo: DebtRepo,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get items(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    this.loadDebtors();
    this.addItem(); // primera fila por defecto

    // Si llega ?debtorId=... lo pre-selecciona
    const q = this.route.snapshot.queryParamMap.get('debtorId');
    if (q) this.form.patchValue({ debtorId: q });

    // actualiza total de cada fila cuando cambien qty o unitPrice
    this.subs.push(
      this.items.valueChanges.subscribe(rows => {
        rows.forEach((r, i) => {
          const total = calcItemTotal(Number(r.qty) || 0, Number(r.unitPrice) || 0);
          this.items.at(i).patchValue({ total }, { emitEvent: false });
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  async loadDebtors() {
    this.debtors.set(await this.debtorRepo.list());
  }

  createRow(): FormGroup {
    return this.fb.group({
      product: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }]
    });
  }

  addItem() { this.items.push(this.createRow()); }
  removeItem(i: number) { if (this.items.length > 1) this.items.removeAt(i); }
  duplicateItem(i: number) {
    const v = this.items.at(i).getRawValue();
    const copy = this.createRow();
    copy.patchValue(v);
    this.items.push(copy);
  }

  grandTotal = computed(() =>
    (this.items.controls ?? []).reduce((s, ctrl) => s + (Number(ctrl.getRawValue().total) || 0), 0)
  );

  async save() {
    if (this.form.invalid || this.items.length === 0) return;

    const raw = this.form.getRawValue();
    await this.debtRepo.create({
      debtorId: raw.debtorId!,
      date: raw.date!,
      note: raw.note || '',
      items: (raw.items ?? []).map((r: any) => ({
        product: (r.product ?? '').trim(),
        qty: Number(r.qty) || 0,
        unitPrice: Number(r.unitPrice) || 0
      }))
    });

    // Regresa a Home
    this.router.navigateByUrl('/');
  }
}
