import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-authenticated',
  template: '',
  providers: [UserService],
})
export class AuthenticatedComponent {

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    if (!localStorage.getItem('jwt')) {
      this.route.params.subscribe(params => localStorage.setItem('jwt', params['jwt']));
    }
    if (!localStorage.getItem('user')) {
      this.userService.getUserInfo().subscribe(
        data => {
          localStorage.setItem('user', data.text());
        },
        err => console.log(err)
      );
    }
    this.router.navigate(['']);
  }

}
