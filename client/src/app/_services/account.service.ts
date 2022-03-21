import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../Models/User';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly baseUrl = environment.apiUrl;


  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http : HttpClient, private route: Router) { }

  login(loginModel:any)
  {
    return this.http.post(this.baseUrl+ "account/login",loginModel).pipe(
      map((res:User)=>
      {
        const user = res;
        if(user)
        {
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }
  register(registerModel: any)
  {
    return this.http.post(this.baseUrl+ "account/register",registerModel).pipe(
      map((user:User)=>{
        if(user)
        {
          this.setCurrentUser(user);
        }
        return user;
      }
    ));
  }

  setCurrentUser(user : User)
  {
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout()
  {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.route.navigateByUrl('/home');
  }

}
