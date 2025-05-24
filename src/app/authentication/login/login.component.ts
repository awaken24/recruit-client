import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../shared/notification.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [FooterComponent, RouterModule, FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: true
})
export class LoginComponent {
    loginType: string = 'candidato';
    title: string = '';
    description: string = '';
    icon: string = '';
    registerRoute: string = '';
    dashboardRoute: string = '';
    completeProfileRoute: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private notifier: NotificationService
    ) {
        this.loginType = this.route.snapshot.url[0]?.path === 'companies' ? 'empresa' : 'candidato';
        this.setLoginConfig();
    }


    private setLoginConfig() {
        if (this.loginType === 'candidato') {
            this.title = 'Bem-vindo ao sistema de Candidatos';
            this.description = 'Cadastre seu currículo, encontre vagas e conecte-se com as melhores oportunidades.';
            this.icon = 'user';
            this.registerRoute = '/users/register';
            this.dashboardRoute = '/candidate/dashboard';
            this.completeProfileRoute = '/candidate/profile/completar';
        } else {
            this.title = 'Bem-vindo ao sistema de Empresas';
            this.description = 'Gerencie suas vagas, encontre talentos e otimize seus processos de recrutamento.';
            this.icon = 'building';
            this.registerRoute = '/companies/register';
            this.dashboardRoute = '/companies/dashboard';
            this.completeProfileRoute = '/companies/profile/completar';
        }
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            const credentials = {
                email: form.value.email,
                password: form.value.password
            };

            this.authService.login(credentials, this.loginType as 'candidato' | 'empresa').subscribe({
                next: (response) => {
                    localStorage.setItem('token', response.access_token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.authService.updateLoginState(true);

                    if (response.user.perfil_completo) {
                        this.router.navigate([this.dashboardRoute]);
                    } else {
                        this.router.navigate([this.completeProfileRoute]);
                    }
                },
                error: (error) => {
                    this.notifier.warning(error.error?.message || 'Erro ao fazer login');
                    console.error('Erro no login:', error);
                },
            });
        } else {
            this.notifier.warning('Por favor, preencha todos os campos corretamente.');
        }
    }

    switchLoginType(type: string) {
        const targetRoute = type === 'candidato' ? '/users/login' : '/companies/login';
        this.router.navigate([targetRoute]);
    }
}
