import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/stores/auth';

@Component({
  selector: 'app-auth-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './auth.html',
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export default class AuthPage {
  readonly authStore = inject(AuthStore);

  signIn(): void {
    this.authStore.login();
  }
}
