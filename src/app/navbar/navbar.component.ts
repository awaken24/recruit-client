import { Component, OnInit, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterModule, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    standalone: true
})
export class NavbarComponent {
    isLoggedIn = false;
    userName: string | null = null;
    isMenuActive = false;
    isUserMenuOpen = false;

    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.isLoggedIn$.subscribe((loggedIn) => {
            this.isLoggedIn = loggedIn;
            if (loggedIn) {
                const user = localStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    if (!parsedUser.nome) {
                        if (parsedUser.usuarioable_type === 'App\\Models\\Empresa') {
                            this.userName = 'Empresa';
                        } else {
                            this.userName = 'Candidato';
                        }
                    } else {
                        this.userName = parsedUser.nome;
                    }
                } else {
                    this.userName = null;
                }
            }
        });
    }    

    toggleMenu() {
        this.isMenuActive = !this.isMenuActive;
    }

    toggleUserMenu() {
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error('Erro ao fazer logout:', error);
            }
        });
    }
}
