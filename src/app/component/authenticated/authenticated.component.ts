import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-authenticated',
  template: '',
})
export class AuthenticatedComponent {

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    // @todo discover why sometimes the page is redirected to the authenticated link two times
    this.route.params.subscribe(params => localStorage.setItem('jwt', params['jwt']));

    const lsUser = localStorage.getItem('user');
    if (!lsUser) {
      this.userService.getUserInfo().subscribe(
        data => {
          const user = data.text();
          // this.userService.setUser(JSON.parse(user));
          localStorage.setItem('user', user);
          this.router.navigate(['']);
        },
        err => console.log(err)
      );
      return;
    }

    // @todo call something on the load and when there's a lsUser to set this line below
    // this.userService.setUser(JSON.parse(lsUser));
    this.router.navigate(['']);
  }

}
