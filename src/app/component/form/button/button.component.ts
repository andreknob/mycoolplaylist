import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input('title') title: string;
  @Input('icon') icon: string;
  @Input('onClick') onClick: Function;

  constructor() { }

  handleClick() {
    if (this.onClick) {
      this.onClick();
    }
  }
}
