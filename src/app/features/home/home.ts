import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideCloudUpload,
  LucideSparkles,
  LucideBrain,
  LucideRadio,
  LucideZap,
} from '@lucide/angular';
import { KeycloakEventType, KEYCLOAK_EVENT_SIGNAL, typeEventArgs } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { AuthStore } from '../../core/stores/auth';

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
  private authStore = inject(AuthStore);
  private keycloakEventSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  private redirected = signal(false);

  constructor() {
    effect(() => {
      const event = this.keycloakEventSignal();

      if (event.type === KeycloakEventType.Ready) {
        const authenticated = typeEventArgs<boolean>(event.args);

        if (authenticated && !this.redirected()) {
          this.authStore.initFromKeycloak(this.keycloak);
          this.redirected.set(true);
          void this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  login(): void {
    this.keycloak.login();
  }
}
