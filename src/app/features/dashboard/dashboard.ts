import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '../../core/stores/auth';
import { ProjectStore } from '../../core/stores/project';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export default class DashboardPage {
  readonly authStore = inject(AuthStore);
  readonly projectStore = inject(ProjectStore);

  /** Placeholder count for loading skeleton cards */
  readonly projectSkeletonSlots = [0, 1, 2, 3] as const;

  constructor() {
    afterNextRender(() => {
      this.projectStore.load();
    });
  }

  signOut(): void {
    this.authStore.logout();
  }

  retryLoad(): void {
    this.projectStore.load();
  }
}
