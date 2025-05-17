import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FormGroup } from '@angular/forms';
import { NotificationService } from '../../../shared/notification.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../../../footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    imports: [CommonModule, ReactiveFormsModule, FooterComponent, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css',
    standalone: true
})
export class ForgotPasswordComponent {
    loading = false;
    submitted = false;
    successMessage = '';
    errorMessage = '';
    emailSent = false;
    emailEnviado = '';
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notifier: NotificationService
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    onSubmit() {
        this.submitted = true;
        this.successMessage = '';
        this.errorMessage = '';

        if (this.form.invalid) return;

        this.loading = true;
        const email = this.form.value.email;

        this.authService.enviarLinkResetSenha(email).subscribe({
            next: () => {
                this.notifier.success('Email de redefinição enviado com sucesso!');
                this.emailSent = true;
                this.emailEnviado = email;
                this.submitted = false;
                this.form.reset();
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Erro ao enviar e-mail. Tente novamente.';
                this.notifier.warning(this.errorMessage);
            },
            complete: () => this.loading = false,
        });
    }

    enviarNovamente() {
        if (!this.emailEnviado) return;

        this.loading = true;
        this.errorMessage = '';

        this.authService.enviarLinkResetSenha(this.emailEnviado).subscribe({
            next: () => {
                this.notifier.success('Email de redefinição reenviado com sucesso!');
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Erro ao reenviar e-mail. Tente novamente.';
                this.notifier.warning(this.errorMessage);
            },
            complete: () => this.loading = false,
        });
    }
}