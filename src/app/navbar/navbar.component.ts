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
    userType: 'candidato' | 'empresa' | null = null;

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
                            this.userType = 'empresa';
                            this.userName = parsedUser.nome || 'Empresa';
                        } else {
                          this.userType = 'candidato';
                            this.userName = parsedUser.nome || 'Candidato';
                        }
                    } else {
                        this.userName = parsedUser.nome;
                    }
                } else {
                    this.userType = null;
                    this.userName = null;
                }
            }
        });
    }

    redirectByProfile(){
      const user = localStorage.getItem('user');

      if (user) {
          const parsedUser = JSON.parse(user);

          if (parsedUser.usuarioable_type === 'App\\Models\\Empresa') {
              this.router.navigate(['/companies/profile']);
          } else {
              this.router.navigate(['candidate/update-profile']);
          }
      } else {
          this.logout();
          this.router.navigate(['/']);
      }
    }

    redirectByDashboard(){
        const user = localStorage.getItem('user');

        if(user){
          const parsedUser = JSON.parse(user);

          if(parsedUser.usuarioable_type === 'App\\Models\\Empresa'){
            this.router.navigate(['/companies/dashboard']);
          } else {
            this.router.navigate(['candidate/dashboard']);
          }
        } else {
          this.logout();
          this.router.navigate(['/']);
        }
    }

    toggleMenu() {
        this.isMenuActive = !this.isMenuActive;
    }

    toggleUserMenu() {
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent){
      const userMenu = document.querySelector('.user-menu');
      const userProfile = document.querySelector('.user-profile');

      if(userMenu && userProfile){
        if(!userProfile.contains(event.target as Node) && !userMenu.contains(event.target as Node)){
          this.isUserMenuOpen = false;
        }
      }
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
