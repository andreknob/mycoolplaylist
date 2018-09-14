import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Input('value') value: string;
  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  constructor() { }

  onChange(newValue) {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
