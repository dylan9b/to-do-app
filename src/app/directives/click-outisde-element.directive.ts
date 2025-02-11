import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  private readonly _el = inject(ElementRef);

  @Output() clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInside = this._el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }
}
