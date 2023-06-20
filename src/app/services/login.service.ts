import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public getUser(user: String, pwd: String){
    return this.http.get(`http://192.168.0.156:8000/api/login?user=${user}&pwd=${pwd}`)
  }





}
