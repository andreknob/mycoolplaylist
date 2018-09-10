import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authenticated',
  template: '',
})
export class AuthenticatedComponent {

  constructor(private route: ActivatedRoute, private router: Router) {
    if (!localStorage.getItem('jwt')) {
      this.route.params.subscribe(params => localStorage.setItem('jwt', params['jwt']));
    }
    if (!localStorage.getItem('user')) {
      // fetch user, set using JSON.stringfy and get using JSON.parse
    }
    this.router.navigate(['']);
  }

}
