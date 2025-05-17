import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from '../../../footer/footer.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../shared/notification.service';

@Component({
    selector: 'app-reset-password',
    imports: [CommonModule, ReactiveFormsModule, FooterComponent, RouterModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
    standalone: true
})
export class ResetPasswordComponent {
    form: FormGroup;
    token: string | null = '';
    email: string | null = '';
    submitted = false;
    loading = false;
    successMessage = '';
    errorMessage = '';
    tokenValido = true;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private notifier: NotificationService
    ) {
        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            password_confirmation: ['', [Validators.required]],
        }, {
            validators: this.checkPasswords
        });
    }

    checkPasswords(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('password_confirmation')?.value;

        return password === confirmPassword ? null : { notSame: true };
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');
        this.email = this.route.snapshot.queryParamMap.get('email');

        if (!this.token || !this.email) {
            this.errorMessage = 'Link inválido. Verifique se o link está completo ou solicite uma nova redefinição.';
            return;
        }

        this.authService.validarTokenReset(this.email, this.token).subscribe({
            next: () => {
                this.tokenValido = true;
            },
            error: (err) => {
                this.tokenValido = false;
                this.errorMessage = err.error?.message || 'Token inválido ou expirado. Por favor, solicite uma nova redefinição.';
            }
        });
    }

    onSubmit() {
        this.submitted = true;
        this.successMessage = '';
        this.errorMessage = '';

        if (this.form.invalid) {
            if (this.form.hasError('notSame')) {
                this.notifier.warning('As senhas não coincidem. Por favor, verifique.');
                return;
            }
            return;
        }

        if (!this.token || !this.email) {
            this.notifier.warning('Dados de redefinição inválidos.');
            return;
        }

        this.loading = true;

        this.authService.redefinirSenha({
            token: this.token,
            email: this.email,
            password: this.form.value.password,
            password_confirmation: this.form.value.password_confirmation,
        }).subscribe({
            next: (response: any) => {
                this.notifier.success(response.message || 'Senha alterada com sucesso!');
                this.successMessage = 'Senha redefinida com sucesso! Você será redirecionado para a página de login.';

                setTimeout(() => {
                    this.router.navigate(['/users/login']);
                }, 3000);

                this.submitted = false;
            },
            error: (err) => {
                this.loading = false;
                this.notifier.warning(err.error?.message || 'Erro ao redefinir senha. Tente novamente.');
            },
            complete: () => this.loading = false,
        });
    }
}