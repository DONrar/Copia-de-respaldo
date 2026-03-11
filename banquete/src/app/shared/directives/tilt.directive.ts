import { Directive, ElementRef, Renderer2, Input, HostListener, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective implements OnInit, OnDestroy {
  @Input() tiltMax = 12;      // grados
  @Input() tiltScale = 1.02;  // leve zoom
  @Input() glare = false;

  private frame = 0;
  private rect!: DOMRect;
  private glareEl?: HTMLElement;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.rect = host.getBoundingClientRect();
    this.r.setStyle(host, 'transformStyle', 'preserve-3d');
    this.r.setStyle(host, 'willChange', 'transform');
    this.r.setStyle(host, 'transition', 'transform 120ms ease');

    if (this.glare) {
      this.glareEl = this.r.createElement('div');
      this.r.setStyle(this.glareEl, 'position', 'absolute');
      this.r.setStyle(this.glareEl, 'inset', '0');
      this.r.setStyle(this.glareEl, 'pointerEvents', 'none');
      this.r.setStyle(this.glareEl, 'mixBlendMode', 'screen');
      this.r.setStyle(this.glareEl, 'opacity', '.35');
      this.r.setStyle(this.glareEl, 'borderRadius', 'inherit');
      this.r.appendChild(host, this.glareEl);
      this.r.setStyle(host, 'position', 'relative');
      this.r.setStyle(host, 'overflow', 'hidden');
    }
  }

  ngOnDestroy(): void { cancelAnimationFrame(this.frame); }

  @HostListener('mouseenter') onEnter() {
    this.rect = this.el.nativeElement.getBoundingClientRect();
  }

  @HostListener('mousemove', ['$event'])
  onMove(ev: MouseEvent) {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const host = this.el.nativeElement;
      const x = (ev.clientX - this.rect.left) / this.rect.width;
      const y = (ev.clientY - this.rect.top) / this.rect.height;
      const rx = (this.tiltMax / 2 - y * this.tiltMax);
      const ry = (x * this.tiltMax - this.tiltMax / 2);
      host.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${this.tiltScale})`;

      if (this.glare && this.glareEl) {
        const gx = x * 100, gy = y * 100;
        this.glareEl.style.background = `radial-gradient(300px 300px at ${gx}% ${gy}%, rgba(255,255,255,.8), rgba(255,255,255,0) 60%)`;
      }
    });
  }

  @HostListener('mouseleave')
  onLeave() {
    const host = this.el.nativeElement;
    host.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    if (this.glareEl) this.glareEl.style.background = 'none';
  } 
}
