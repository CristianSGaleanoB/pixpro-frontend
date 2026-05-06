import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  viewChild,
  ElementRef,
} from '@angular/core';
import { LucideTrash } from '@lucide/angular';
import { Project } from '../../../core/interfaces/project';
import { ProjectStore } from '../../../core/stores/project';

@Component({
  selector: 'app-delete-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideTrash],
  templateUrl: './delete-dialog.html',
})
export class DeleteDialog {
  @Input() project!: Project;

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  readonly projectStore = inject(ProjectStore);

  openModal(): void {
    this.modal().nativeElement.showModal();
  }

  closeModal(): void {
    this.modal().nativeElement.close();
  }

  onConfirm(): void {
    this.projectStore.delete(this.project._id);
    this.closeModal();
  }
}
