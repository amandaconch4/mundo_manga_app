import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = localStorage.getItem('userActive') === 'true';
    
    // Si no hay sesión activa, redirige a la página de login
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}
