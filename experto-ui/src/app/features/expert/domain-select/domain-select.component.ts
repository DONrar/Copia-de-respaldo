import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

type DomainView = { code: string; name: string; desc: string; emoji: string };


@Component({
  selector: 'app-domain-select',
  imports: [CommonModule, RouterLink],
  templateUrl: './domain-select.component.html',
  styleUrl: './domain-select.component.scss'
})
export class DomainSelectComponent {

   domains: DomainView[] = [
    { code: 'SALUD',      name: 'Salud',      desc: 'Síntomas respiratorios básicos', emoji: '🩺' },
    { code: 'VEHICULOS',  name: 'Vehículos',  desc: 'Posibles fallas comunes',        emoji: '🚗' },
    { code: 'MANTENIMIENTO', name: 'Mantenimiento', desc: 'Equipos y computadoras', emoji: '🛠️' },
    { code: 'EDUCACION',  name: 'Educación',  desc: 'Rendimiento académico',         emoji: '📚' },
  ];

  constructor(private router: Router) {}
  go(code: string) { this.router.navigate(['/expert', code]); }
}
