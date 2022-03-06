import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  readonly url= "https://localhost:5001/api/";
  registerMode = false;
  users:any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
  }
  registerToggle()
  {
    this.registerMode = ! this.registerMode;
  }

  cancelRegisterMode(event: boolean)
  {
    this.registerMode = event;
  }

  getUsers()
  {
    this.http.get(this.url + "users").subscribe(users => this.users = users);
  }



}
