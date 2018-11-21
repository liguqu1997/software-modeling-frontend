import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { switchAll } from '../../../../node_modules/rxjs/operators';
import swal from 'sweetalert';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountService
  ) {
  }

  ngOnInit() {
    const self = this;
    if (self.service.isLoggedIn()) {
      self.router.navigate(['/home']);
    }
    self.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmedPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      email: new FormControl('', Validators.compose([Validators.required,
        Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)]))
    });
  }

  validate() {
    const self = this;
    const errors = [

      !self.registerForm.controls['username'].valid ? 'Username is required.' : null,

      !self.registerForm.controls['password'].valid ?
        (!self.registerForm.controls['password'].value || !self.registerForm.controls['password'].value.trim() ?
          'Password is required.' : 'Password must be more than 6 characters.') : null,

      !self.registerForm.controls['confirmedPassword'].valid ?
        (!self.registerForm.controls['confirmedPassword'].value || !self.registerForm.controls['confirmedPassword'].value.trim() ?
          'Confirmed password is required.' : 'Confirmed password must be more than 6 characters.') :
        self.registerForm.controls['password'].value !== self.registerForm.controls['confirmedPassword'].value ?
          'Password and Confirmed Password do not match.' : null,

      !self.registerForm.controls['email'].valid ?
        (!self.registerForm.controls['email'].value || !self.registerForm.controls['email'].value.trim() ?
          'Email is required.' : 'Email is invalid.') : null,
    ];

    return errors.filter(e => e != null).join('\n');
  }

  onSubmit(value) {
    const self = this;
    if (self.validate() !== '') {
      swal({
        title: 'Failed to register!',
        text: self.validate(),
        icon: 'error'
      });
    } else {
      self.service.register(value).subscribe(() => {
        swal({
          title: 'Congratulations!',
          text: 'Register successfully.',
          icon: 'success'
        }).then(() => {
          self.router.navigate(['/home']);
        });
      }, error => {
        swal({
          title: 'Failed to register!',
          text: 'This username is unavailable, please try another.',
          icon: 'error'
        });
      });
    }
  }
}
