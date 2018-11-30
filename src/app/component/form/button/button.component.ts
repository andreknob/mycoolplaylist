import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input('title') title: string;
  @Input('icon') icon: string;
  @Input('secondary') secondary: boolean;
  @Input('disabled') disabled: boolean;
  @Input('onClick') onClick: Function;

  constructor() { }

  handleClick() {
    if (this.onClick && !this.disabled) {
      this.onClick();
    }
  }
}
