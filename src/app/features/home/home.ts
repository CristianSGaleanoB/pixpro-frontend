import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideCloudUpload,
  LucideSparkles,
  LucideBrain,
  LucideRadio,
  LucideZap,
} from '@lucide/angular';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  imports: [RouterLink, LucideCloudUpload, LucideSparkles, LucideBrain, LucideRadio, LucideZap],
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export default class HomePage {}
