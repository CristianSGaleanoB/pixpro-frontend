import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/stores/auth';
import { ProjectStore } from '../../core/stores/project';
import { Project } from '../../core/interfaces/project';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
  imports: [RouterLink],
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

  confirmDelete(project: Project): void {
    if (
      confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)
    ) {
      this.projectStore.delete(project._id);
    }
  }

  createProject(): void {
    const name = document.getElementById('project_name') as HTMLInputElement;
    this.projectStore.create(name.value);
  }
}
