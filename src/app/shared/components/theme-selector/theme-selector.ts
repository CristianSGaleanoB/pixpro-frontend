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
  protected themes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
    'caramellatte',
    'abyss',
    'silk',
  ];
}
