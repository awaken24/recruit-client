import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notification',
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
    @Input() message: string = '';
    @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
    @Input() duration: number = 3000;

    constructor(private elementRef: ElementRef) { }

    ngOnInit(): void {
        setTimeout(() => this.close(), this.duration);
    }

    close(): void {
        this.elementRef.nativeElement.remove();
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '';
        }
    }
}
