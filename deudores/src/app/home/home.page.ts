import { Component, effect, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonInput, IonButton
} from '@ionic/angular/standalone';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Debtor } from '../domain/models';
import { DebtorRepo } from '../domain/repos/debtor.repo';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common'; // 👈 NUEVO
import { StorageService } from '../core/storage/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ CommonModule, DatePipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton,
    ReactiveFormsModule, RouterLink],
})

export class HomePage {
  debtors = signal<Debtor[]>([]);
  form = this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]] });

  constructor(private fb: FormBuilder, private repo: DebtorRepo) {
    this.load();
    effect(() => console.log('Deudores ->', this.debtors()));
  }

  async load() { this.debtors.set(await this.repo.list()); }

  async add() {
    const name = this.form.value.name?.trim();
    if (!name) return;
    await this.repo.upsert({ name });
    this.form.reset();
    await this.load();
  }

  async remove(id: string) {
    await this.repo.remove(id);
    await this.load();
  }
}
