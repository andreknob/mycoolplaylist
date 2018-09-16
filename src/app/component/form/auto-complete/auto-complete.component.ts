import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent {

  private _value;
  private _results;
  private _displayAutoComplete;

  @Input() onClickSearch: Function;

  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  constructor() {
    this.results = ['item 1', 'item 2'];
    this._displayAutoComplete = false;
  }

  handleClick($event: Event) {
    $event.stopPropagation();
    this.displayAutoComplete = !this.displayAutoComplete;
  }

  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    this.displayAutoComplete = false;
  }

  handleClickSearch($event: Event) {
    if (this.onClickSearch) {
      $event.stopPropagation();
      this.onClickSearch();
    }
  }

  @Input()
  set value(value: string) {
    this._value = value;
    this.valueChange.emit(value);
  }

  get value(): string {
    return this._value;
  }

  set results(results: Array<string>) {
    this._results = results;
  }

  get results(): Array<string> {
    return this._results;
  }

  set displayAutoComplete(_displayAutoComplete: Boolean) {
    this._displayAutoComplete = _displayAutoComplete;
  }

  get displayAutoComplete(): Boolean {
    return this._displayAutoComplete;
  }
}
