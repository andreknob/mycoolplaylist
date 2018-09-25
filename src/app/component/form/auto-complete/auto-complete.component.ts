import { Component, Input, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';

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

  constructor(private eRef: ElementRef) {
    this.results = ['item 1', 'item 2'];
    this._displayAutoComplete = false;
  }

  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    if (this.eRef.nativeElement.contains($event.target)) {
      this.displayAutoComplete = !this.displayAutoComplete;
    } else {
      this.displayAutoComplete = false;
    }
  }

  handleClickSearch() {
    if (this.onClickSearch) {
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
