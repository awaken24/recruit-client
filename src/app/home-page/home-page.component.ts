import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home-page',
    imports: [FooterComponent, RouterModule, CommonModule],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    standalone: true,
})
export class HomePageComponent {

    constructor(private router: Router) {}

    redirectEmpresa() {
        const user = localStorage.getItem('user');

        if (user) {
            const parsedUser = JSON.parse(user);

            if (parsedUser.usuarioable_type === 'App\\Models\\Empresa') {
                this.router.navigate(['/companies/dashboard']);
            } else {
                this.router.navigate(['/companies/register']);
            }
        } else {
            this.router.navigate(['/companies/register']);
        }
    }
}
