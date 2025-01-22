import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailSend } from '../model/mail.model';
import { ObjectUnsubscribedErrorCtor } from 'rxjs/internal/util/ObjectUnsubscribedError';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../../constant.model';
import { EmailForgot } from '../model/email-forgot.model';
import { OTPResponse } from '../model/otp.model';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  constructor(private http : HttpClient) { }

  sendEmail(model : EmailSend) : Observable<string>
  {
    return this.http.post<string>(`${BASE_URL}/SendEmail/send`,model);
  }

  sendEmailForgotPassword(model : EmailForgot) : Observable<OTPResponse>
  {
    return this.http.post<OTPResponse>(`${BASE_URL}/SendEmail/send-otp`, model)
  }
}
