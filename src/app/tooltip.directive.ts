import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';
  tooltipElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.setProperty(this.tooltipElement, 'innerHTML', this.tooltipText);
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Styling
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    // this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'background', '#033d54d9');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '5px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '13px');
    this.renderer.setStyle(this.tooltipElement, 'max-width', '450px');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'normal');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999999');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 0 10px rgba(0,0,0,0.3)');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease-in-out');

    // Position calculation
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipWidth = 300;
    const spacing = 10;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate vertical position with at least 10% margin from top
    let rawTop = rect.top + rect.height / 2;
    let minTop = windowHeight * 0.1;
    let top = Math.max(rawTop + spacing, minTop);

    // Clamp from bottom as well (optional)
    const tooltipHeight = this.tooltipElement.offsetHeight || 50;
    const maxTop = windowHeight - tooltipHeight - 10;
    top = Math.min(top, maxTop);

    // Calculate horizontal position (right or left)
    let left: number;
    if (rect.right + spacing + tooltipWidth < windowWidth) {
      left = rect.right + spacing; // Show to the right
    } else {
      left = rect.left - tooltipWidth - spacing; // Show to the left
    }

    // Apply final styles
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
  }
}
