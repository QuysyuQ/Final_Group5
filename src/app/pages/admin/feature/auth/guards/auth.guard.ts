import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService} from 'ngx-cookie-service';
import { authInterceptor } from '../../../core/interceptor/auth.interceptor';
import { AuthService } from '../service/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  let token = cookieService.get('Authentication');

  if(user && token )
    {
      token = token.replace('Bearer','');
      const decodeToken : any = jwtDecode(token);
      
      const expirationDate = decodeToken.exp * 1000;
      const currentTime = new Date().getTime();

      if(expirationDate < currentTime)
        {
          authService.logOut();

          return router.createUrlTree(['/loginwebsite'],{queryParams : { returnUrl: state.url}});
        }

      
      if (state.url.includes('admin')) {
          const role = decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          //console.log(decodeToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);

          //Nếu vai trò là 'User', chuyển hướng tới trang đăng nhập admin
          if (role === 'User') {
            localStorage.clear();
            authService.logOut();
            return router.createUrlTree(['/loginwebsite'], { queryParams: { returnUrl: state.url } });
          }
      }
      return true;
    }

      authService.logOut();
      return router.createUrlTree(['/loginwebsite'],{queryParams : {returnUrl : state.url}})
}
