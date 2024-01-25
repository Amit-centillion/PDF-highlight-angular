import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  userValidation(userId:any){
    let params = new HttpParams();
    params = params.append('user', userId);

    return this.http.get(this.baseUrl + `api/Account/ValidateUser`,{params:params})
  }
}
