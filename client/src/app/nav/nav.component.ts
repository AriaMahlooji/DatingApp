import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
import { AccountService } from '../_services/account.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {

  loginModel: any={};
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {

  }

  login()
  {
    this.accountService.login(this.loginModel).subscribe(
      (res:any)=>
      {
        console.log(res);
      },err=>
      {
        console.log(err);
      }
    )
  }
  logout()
  {
    this.accountService.logout();
  }
}
