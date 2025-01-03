import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
  standalone: true
})
export class LoadingSpinnerComponent {
    @Input() message: string = 'Carregando...';
}
