import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeSelectorComponent } from '../../theme-selector/theme-selector';
import { HasRolesDirective } from 'keycloak-angular';
import { AuthStore } from '../../../../core/stores/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink, ThemeSelectorComponent, HasRolesDirective],
})
export class NavbarComponent {
  private router = inject(Router);
  private authStore = inject(AuthStore);

  isDashboard(): boolean {
    return this.router.url === '/dashboard';
  }

  isLoggedIn(): boolean {
    return this.authStore.isAuthenticated();
  }
}
