import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { ImageStore } from '../../../core/stores/image';
import { ProjectStore } from '../../../core/stores/project';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
  imports: [RouterLink],
})
export default class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly imageStore = inject(ImageStore);
  readonly projectStore = inject(ProjectStore);

  readonly projectId = signal<string>('');

  private fileInputEl: HTMLInputElement | null = null;

  constructor() {
    afterNextRender(() => {
      const id = this.route.snapshot.paramMap.get('id') ?? '';
      this.projectId.set(id);

      if (id) {
        this.imageStore.loadImages(id);

        if (this.projectStore.isEmpty()) {
          this.projectStore.load();
        }
      }
    });
  }

  get currentProject() {
    return this.projectStore.projects().find((p) => p.id === this.projectId());
  }

  registerFileInput(el: HTMLInputElement): void {
    this.fileInputEl = el;
  }

  triggerFileInput(): void {
    this.fileInputEl?.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(Array.from(input.files));
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadFiles(Array.from(event.dataTransfer.files));
    }
  }

  private uploadFiles(files: File[]): void {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, WEBP allowed.`);
        return;
      }

      this.imageStore.uploadImage({ projectId: this.projectId(), file });
    });
  }
}
