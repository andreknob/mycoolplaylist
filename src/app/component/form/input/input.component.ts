import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Input() onChange: Function;
  @Input() onKeydown: Function;
  @Input() placeholder: String;
  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  constructor() { }

  @Input()
  set value(value: string) {
    this.valueChange.emit(value);
  }

  handleModelChange(e) {
    if (this.onChange) {
      this.onChange(e);
    }
  }

  handleKeydown(e) {
    if (this.onKeydown) {
      this.onKeydown(e);
    }
  }
}
