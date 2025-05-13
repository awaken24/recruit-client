import { NgForm, FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';

@Component({
	selector: 'app-login-candidato',
	imports: [FooterComponent, RouterModule, FormsModule],
	templateUrl: './login-candidato.component.html',
	styleUrl: './login-candidato.component.css',
	standalone: true
})
export class LoginCandidatoComponent {

	constructor(
		private authService: AuthService, 
		private router: Router,
		private notifier: NotificationService
	) { }

	onSubmit(form: NgForm) {
		if (form.valid) {
			const formData = form.value;

			this.authService.login(formData, 'candidato').subscribe({
				next: (response) => {
					localStorage.setItem('token', response.access_token);
					localStorage.setItem('user', JSON.stringify(response.user));
					this.authService.updateLoginState(true);

					if (response.user.perfil_completo) {
						this.router.navigate(['candidate/dashboard']);
					} else {
						this.router.navigate(['candidate/profile/completar']);
					}
				},
				error: (error) => {
					this.notifier.warning(error.error.message)
					console.error('Erro no login do candidato:', error);
				},
			});
		} else {
			alert('Por favor, preencha todos os campos corretamente.');
		}
	}
}
