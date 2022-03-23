import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { max } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent:any; //Parent to Child communication
  @Output() cancelRegister = new EventEmitter(); //Child to Parent communication
  maxDate : Date;
  registerForm : FormGroup;
  vaidationErrors: string[] =[];
  constructor(private accountService: AccountService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeRegisterForm();
    this.maxDate = new Date;
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  register()
  {
    // console.log(this.registerForm.value);
    this.accountService.register(this.registerForm.value).subscribe(res=>{
        this.router.navigateByUrl('/members');
      },
      err=>{
        this.vaidationErrors = err;
        console.log(err);
      }
    );
  }
  cancel()
  {
    this.cancelRegister.emit(false);
  }

  initializeRegisterForm()
  {
    this.registerForm = this.fb.group({
      gender: ['female',Validators.required],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(9), this.hasSpecialChar()]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe(()=>
    {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  //validator function for matching passwords
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl)=> {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  hasSpecialChar(): ValidatorFn
  {
    return (control: AbstractControl)=>{
      let regEx =new RegExp('.*(?=[^\\W]*\\W).*');
      return regEx.test(control?.value) ? null : {includeSpecialChar: true}
    }
  }

}
