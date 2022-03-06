import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../Models/User';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly baseUrl = "https://localhost:5001/api/";

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http : HttpClient) { }

  login(loginModel:any)
  {
    return this.http.post(this.baseUrl+ "account/login",loginModel).pipe(
      map((res:User)=>
      {
        const user = res;
        if(user)
        {
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }
  register(registerModel: any)
  {
    return this.http.post(this.baseUrl+ "account/register",registerModel).pipe(
      map((user:User)=>{
        if(user)
        {
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      }
    ));
  }

  setCurrentUser(user : User)
  {
    this.currentUserSource.next(user);
  }

  logout()
  {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

}
