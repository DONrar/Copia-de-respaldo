import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { TiltDirective } from './shared/directives/tilt.directive';
import { RevealDirective } from './shared/directives/reveal.directive';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TiltDirective, RevealDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'banquete';

  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

 @HostListener('window:scroll') onScroll() { this.updateProgress(); }
  @HostListener('window:resize') onResize() { this.updateProgress(); }
  ngOnInit() { this.updateProgress(); }

  private updateProgress() {
    const doc = document.documentElement;
    const max = (doc.scrollHeight - doc.clientHeight) || 1;
    const pct = Math.min(1, Math.max(0, doc.scrollTop / max));
    doc.style.setProperty('--scroll-progress', `${pct * 100}%`);
  }
}
