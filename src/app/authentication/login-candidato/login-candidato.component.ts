import { NgForm, FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login-candidato',
	imports: [FooterComponent, RouterModule, FormsModule],
	templateUrl: './login-candidato.component.html',
	styleUrl: './login-candidato.component.css',
	standalone: true
})
export class LoginCandidatoComponent {

	constructor(private authService: AuthService, private router: Router) { }

	onSubmit(form: NgForm) {
		if (form.valid) {
			const formData = form.value;

			this.authService.login(formData, 'candidato').subscribe({
				next: (response) => {
					localStorage.setItem('token', response.access_token);
					localStorage.setItem('user', JSON.stringify(response.user));
					this.authService.updateLoginState(true);

					if (response.user.perfil_completo) {
						this.router.navigate(['']);
					} else {
						this.router.navigate(['/companies/updateProfile']);
					}
				},
				error: (error) => {
					console.error('Erro no login do candidato:', error);
					alert('Erro ao realizar login.');
				},
			});
		} else {
			alert('Por favor, preencha todos os campos corretamente.');
		}
	}
}
