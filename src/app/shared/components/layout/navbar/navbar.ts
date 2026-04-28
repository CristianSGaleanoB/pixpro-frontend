import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSelectorComponent } from '../../theme-selector/theme-selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink, ThemeSelectorComponent],
})
export class NavbarComponent {}
