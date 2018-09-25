import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {

  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  constructor() { }

  @Input()
  set value(value: string) {
    this.valueChange.emit(value);
  }

}
