import { Component, inject, Input, OnInit } from '@angular/core';
import { LucidePencil, LucideX } from '@lucide/angular';
import { Project } from '../../../core/interfaces/project';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ProjectStore } from '../../../core/stores/project';

@Component({
  selector: 'app-edit-dialog',
  imports: [LucidePencil, LucideX, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-dialog.html',
})
export class EditDialog implements OnInit {
  @Input()
  project!: Project;
  readonly projectStore = inject(ProjectStore);
  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  newTag = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.project.name, Validators.required],
      tags: this.fb.array(this.project.tags.map((tag: string) => this.fb.control(tag))),
    });
  }

  openModal(): void {
    const modal = document.getElementById(`${this.project._id}-edit-modal`) as HTMLDialogElement;
    modal.showModal();
  }

  closeModal(): void {
    const modal = document.getElementById(`${this.project._id}-edit-modal`) as HTMLDialogElement;
    modal.close();
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  addTag(): void {
    const tag = this.newTag.trim();
    if (!tag) return;
    this.tags.push(this.fb.control(tag));
    this.newTag = '';
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onConfirm(): void {
    if (this.form.invalid) return;

    const payload = {
      name: this.form.value.name,
      tags: this.tags.value,
    };

    this.projectStore.edit({ id: this.project._id, info: payload });
    this.projectStore.load();
    this.closeModal();
  }
}
