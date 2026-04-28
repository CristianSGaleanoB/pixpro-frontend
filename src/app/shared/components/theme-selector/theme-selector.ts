import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { LucidePalette, LucideChevronDown } from '@lucide/angular';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.html',
  imports: [LucidePalette, LucideChevronDown],
})
export class ThemeSelectorComponent {
  protected themeService = inject(ThemeService);
  protected themes = ['light', 'dark'];
}
