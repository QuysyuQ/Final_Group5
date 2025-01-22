import { Component } from '@angular/core';
import { User } from '../../feature/auth/models/user.model';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../feature/auth/service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderWebsiteComponent } from '../../../website/core/header-website/header-website.component';

@Component({
  selector: 'app-navbar-admin',
  imports: [ FormsModule, CommonModule, RouterLink ],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {
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
    return this.router.url.includes('loginwebsite')
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('loginwebsite')
  }
  

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    var activeMode : string = String(this.isDarkMode) ; 

    localStorage.setItem('darkMode',activeMode);
  }
}