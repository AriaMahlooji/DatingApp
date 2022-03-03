import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;
  readonly url= "https://localhost:5001/api/";

  constructor(private http :HttpClient){}


  ngOnInit() {
    this.getUsers();
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
