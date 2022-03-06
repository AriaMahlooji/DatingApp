import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './Models/User';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;
  readonly url= "https://localhost:5001/api/";

  constructor(private http :HttpClient, private accountService : AccountService){}


  ngOnInit() {
    this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser()
  {
   const user : User = JSON.parse(localStorage.getItem("user"));
   this.accountService.setCurrentUser(user);
  }


  getUsers()
  {
    this.http.get(this.url+"users").subscribe(res=>
      {
        this.users = res;
      },err =>
      {
        console.log(err);
      }
      )
  }

}
