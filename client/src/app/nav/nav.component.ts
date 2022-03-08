import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { User } from '../Models/User';
import { AccountService } from '../_services/account.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {

  ali: string = "salam";
  loginModel: any={};
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }
  ngOnInit(): void {

  }

  login()
  {
    this.accountService.login(this.loginModel).subscribe(
      (res:any)=>
      {
        console.log(this.loginModel);
        console.log(res);
        this.router.navigateByUrl("/members");
      },err=>
      {
        console.log(err);
        this.toastr.error(err.error );

      }
    )
  }
  logout()
  {
    this.accountService.logout();
  }
}
