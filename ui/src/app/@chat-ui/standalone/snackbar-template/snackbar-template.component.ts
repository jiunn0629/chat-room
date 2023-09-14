import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar-template.component.html',
  styleUrls: ['./snackbar-template.component.scss']
})
export class SnackbarTemplateComponent {
  @Input() label: string;
  @Input() actionLabel: string;
  @Output() action: EventEmitter<void> = new EventEmitter<void>();

  public onAction() {
    this.action.emit();
  }
}
