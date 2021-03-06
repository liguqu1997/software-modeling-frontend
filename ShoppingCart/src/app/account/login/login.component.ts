import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { switchAll } from '../../../../node_modules/rxjs/operators';
import swal from 'sweetalert';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: string;
  password: string;
  constructor(private router: Router, private service: AccountService) {}

  ngOnInit() {
    const self = this;
    if (self.service.isLoggedIn()) {
      self.router.navigate([ '/home' ]);
    }
    self.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit(value) {
    const self = this;
    this.service.login(value).subscribe((r) => {
      switch (r) {
        case 'SUCCESS':
          swal({
            title: 'Congratulations!',
            text: 'Login successfully.',
            icon: 'success'
          }).then(() => self.router.navigate([ '/home' ]));
          break;
        case 'USERNAME_OR_PASSWORD_INVALID':
          swal({
            title: 'Error!',
            text: 'ID or password is incorrect.',
            icon: 'error'
          });
          break;
      }
    });
  }
}
