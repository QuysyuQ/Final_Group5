import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customerAdd } from '../model/customerAdd.model';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../../constant.model';
import { customerResponse } from '../model/customer.model';
import { RoleReponse } from '../model/roles.model';
import { UserRole } from '../model/user-role.model';
import { AccountUpdateGiveUser } from '../../../../website/feature/auth/model/account.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http : HttpClient) { }

  creatUser(model : customerAdd) : Observable<void>
  {
    return this.http.post<void>(`${BASE_URL}/Authentication/register-user`,model)
  }

  getAllUser() : Observable<customerResponse[]>
  {
    return this.http.get<customerResponse[]>(`${BASE_URL}/Authentication/get-all-user`)
  }

  getUserById(id : string) : Observable<customerResponse>
  {
    return this.http.get<customerResponse>(`${BASE_URL}/Authentication/get-user-by-id/${id}`)
  }

  searchUser(name : string) : Observable<customerResponse[]>
  {
    return this.http.get<customerResponse[]>(`${BASE_URL}/Authentication/search-user-name`)
  }

  updateUser(id : string, model : customerAdd) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/Authentication/update-user-by-id/${id}`,model)
  }

  deleteUser(id: string) : Observable<void>
  {
    return this.http.delete<void>(`${BASE_URL}/Authentication/delete-user-by-id/${id}`)
  }

  getAllRoles() : Observable<RoleReponse[]>
  {
    return this.http.get<RoleReponse[]>(`${BASE_URL}/Role/get-all-roles`)
  }

  getRoleById(id : string) : Observable<RoleReponse>
  {
    return this.http.get<RoleReponse>(`${BASE_URL}/Role/get-role-by-id/${id}`)
  }

  getAllUserRoleS() : Observable<UserRole[]>
  {
    return this.http.get<UserRole[]>(`${BASE_URL}/Authentication/get-all-user-and-role`)
  }

  getCustomerByPage(page: number, pageSize : number): Observable<customerResponse[]> {
    
    return this.http.get<customerResponse[]>(`${BASE_URL}/Authentication/get-user-page?page=${page}&pageSize=${pageSize}`);
  }

  getCustomerByEmail(email : string) : Observable<customerResponse>
  {
    return this.http.get<customerResponse>(`${BASE_URL}/Authentication/get-user-equal-email/${email}`)
  }

  updateAccount(id : string, updateGiveUser : AccountUpdateGiveUser) : Observable<void>
  {
    return this.http.put<void>(`${BASE_URL}/Authentication/update-account-id/${id}`,updateGiveUser);
  }
}
