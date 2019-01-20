import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-authenticated',
  template: '',
})
export class AuthenticatedComponent {

  // @todo chamar autenticação quando o usuário não estiver autenticado e clicar no 'use your top songs'
  // ou digitar algo no input
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.route.params.subscribe(params => localStorage.setItem('jwt', params['jwt']));

    const lsUser = localStorage.getItem('user');
    if (!lsUser) {
      this.userService.getUserInfo().subscribe(
        data => {
          const user = data.text();

          localStorage.setItem('user', user);
          this.userService.setAuthenticated(true);

          this.router.navigate(['']);
        },
        err => console.log(err)
      );
      return;
    }

    this.router.navigate(['']);
  }

}
