import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './pages/admin/feature/auth/service/auth.service';
import { User } from './pages/admin/feature/auth/models/user.model';
import { HeaderWebsiteComponent } from "./pages/website/core/header-website/header-website.component";
import { TailWebsiteComponent } from "./pages/website/core/tail-website/tail-website.component";
import { NavbarAdminComponent } from './pages/admin/core/navbar-admin/navbar-admin.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink, HeaderWebsiteComponent, TailWebsiteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'clothing-website';

  isDarkMode: boolean;
  user? : User ;
  constructor(private router : Router,
              private authService : AuthService
  ){
    const darkModeStorage = localStorage.getItem("darkMode");
    this.isDarkMode = darkModeStorage === 'true'

  }

  ngOnInit() :void {
    this.authService.user().subscribe({
      next : response => {
        this.user = response
      }
    });
    this.user = this.authService.getUser();
    if(this.isDarkMode)
    {
      document.querySelector(".paren")?.classList.add('dark');
    }
    else
    {
      document.querySelector(".paren")?.classList.remove('dark');
    }
  }

  isAdminPage() : boolean
  {
    return this.router.url.includes('admin')
  }

  isUserPage() : boolean
  {
    return this.router.url.includes('user')
  }

  isLogOut(): any {
    return this.router.url.includes('login')
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('login')
  }
  

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    var activeMode : string = String(this.isDarkMode) ; 

    localStorage.setItem('darkMode',activeMode);
  }
}
