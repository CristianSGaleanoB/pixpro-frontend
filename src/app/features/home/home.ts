import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideCloudUpload,
  LucideSparkles,
  LucideBrain,
  LucideRadio,
  LucideZap,
} from '@lucide/angular';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  standalone: true,
  imports: [LucideCloudUpload, LucideSparkles, LucideBrain, LucideRadio, LucideZap],
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export default class HomePage {
  private keycloak = inject(Keycloak);
  private router = inject(Router);

  login(): void {
    this.keycloak.login();
  }
}
