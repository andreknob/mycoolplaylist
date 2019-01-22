import {
  OnInit,
  AfterViewInit,
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  HostListener,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit, AfterViewInit {

  private _value;
  private _results;
  private _resultsElements;
  private _displayAutoComplete;
  private _searchTimeout;

  @Input() onSearch: Function;
  @Input() onSelect: Function;
  @Input() placeholder: String;

  @Output() valueChange: EventEmitter<String> = new EventEmitter<String>();

  @ViewChildren('resultsQueryList') resultsQueryList: any;

  constructor(private eRef: ElementRef) {
    this.results = [];
    this._displayAutoComplete = false;
  }

  ngOnInit() {
    const searchTerm = localStorage.getItem('searchTerm');
    if (searchTerm) {
      this.value = searchTerm;
      this.handleSearch();
      localStorage.removeItem('searchTerm');
    }
  }

  ngAfterViewInit() {
    this.resultsQueryList.changes.subscribe(res => {
      this.resultsElements = res.toArray();
    });
  }

  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    if (this.eRef.nativeElement.contains($event.target)) {
      // if's input, display = true
      this.displayAutoComplete = !this.displayAutoComplete;
    } else {
      this.displayAutoComplete = false;
    }
  }

  handleSearch = () => {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!this.onSearch || !this.value) {
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.onSearch(this.value).subscribe(data => {
        this.results = JSON.parse(data.text());
        this.displayAutoComplete = true;
      },
        error => console.log(error)
      );
    }, 500);
  }

  handleSelectItem(item) {
    if (this.onSelect) {
      this.onSelect(item);
    }
  }

  handleKeydown(event, item, i) {
    event.preventDefault();

    let element;
    switch (event.keyCode) {
      case 13:
        this.displayAutoComplete = false;
        this.handleSelectItem(item);
        break;
      case 38:
        element = this.resultsElements[i - 1];
        if (element) {
          element.nativeElement.focus();
        }
        break;
      case 40:
        element = this.resultsElements[i + 1];
        if (element) {
          element.nativeElement.focus();
        }
        break;
    }
  }

  handleInputKeydown = (event) => {
    if (event.keyCode === 40) {
      this.displayAutoComplete = true;
      if (this.resultsElements) {
        const element = this.resultsElements[0];
        if (element) {
          element.nativeElement.focus();
        }
      } else {
        this.displayAutoComplete = false;
      }
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

  set resultsElements(resultsElements) {
    this._resultsElements = resultsElements;
  }

  get resultsElements() {
    return this._resultsElements;
  }

  set displayAutoComplete(displayAutoComplete: Boolean) {
    this._displayAutoComplete = displayAutoComplete;
  }

  get displayAutoComplete(): Boolean {
    return this._displayAutoComplete;
  }

  set searchTimeout(searchTimeout) {
    this._searchTimeout = searchTimeout;
  }

  get searchTimeout() {
    return this._searchTimeout;
  }
}
