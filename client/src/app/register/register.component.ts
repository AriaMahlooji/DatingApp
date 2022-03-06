import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent:any; //Parent to Child communication
  @Output() cancelRegister = new EventEmitter(); //Child to Parent communication

  registerModel: any ={};
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register()
  {
    this.accountService.register(this.registerModel).subscribe(res=>{
        console.log(res);
        this.cancel();
      },
      err=>{
        console.log(err);
      }
    );
  }
  cancel()
  {
    this.cancelRegister.emit(false);
  }
}
