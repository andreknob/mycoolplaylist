import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  private _value: String;
  @Input() onChange: Function;
  @Input() onKeydown: Function;
  @Input() label: String;
  @Input() placeholder: String = '';
  @Input() inputLarge: Boolean = false;
  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  constructor() { }

  @Input()
  set value(value: String) {
    this._value = value;
    this.valueChange.emit(value);
  }

  get value(): String {
    return this._value;
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
