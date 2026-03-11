import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

type Dir = 'up' | 'down' | 'left' | 'right' | 'scale';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() revealDirection: Dir = 'up';
  @Input() revealDelay = 0; // ms
  @Input() revealOnce = true;

  private io?: IntersectionObserver;
  private revealed = false;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngOnInit(): void {
    const n = this.el.nativeElement;
    const t = this.initialTransform(this.revealDirection);
    this.r.setStyle(n, 'opacity', '0');
    this.r.setStyle(n, 'transform', t);
    this.r.setStyle(n, 'transition', `transform 600ms cubic-bezier(.2,.8,.2,1) ${this.revealDelay}ms, opacity 600ms ease ${this.revealDelay}ms`);
    this.io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && (!this.revealOnce || !this.revealed)) {
          this.revealed = true;
          this.r.setStyle(n, 'opacity', '1');
          this.r.setStyle(n, 'transform', 'none');
          if (this.revealOnce) this.io?.disconnect();
        }
      });
    }, { threshold: 0.14 });
    this.io.observe(n);
  }

  ngOnDestroy(): void { this.io?.disconnect(); }

  private initialTransform(d: Dir): string {
    switch (d) {
      case 'down':  return 'translateY(-16px)';
      case 'left':  return 'translateX(16px)';
      case 'right': return 'translateX(-16px)';
      case 'scale': return 'scale(.98)';
      default:      return 'translateY(16px)'; // up
    }
  }
}
