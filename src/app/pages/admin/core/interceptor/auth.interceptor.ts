import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authenToken = inject(CookieService).get('Authentication');

  const authenReq = req.clone({
    setHeaders: {
      'Authorization' : authenToken
    }
  })
  
  return next(authenReq);
};
