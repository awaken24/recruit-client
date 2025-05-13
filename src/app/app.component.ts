import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'recruit-client';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.checkAuthStatus().subscribe({
            next: () => {
                this.authService.updateLoginState(true);
            },
            error: () => {
                this.authService.logout().subscribe();
                // this.router.navigate(['/users/login']);
            }
        });
    }
}
