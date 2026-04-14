import { Component, signal } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { LayoutComponent } from './shared/components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [LayoutComponent, NgxSonnerToaster],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
