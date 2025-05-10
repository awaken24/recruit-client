import { NgForm, FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { EmpresaService } from '../../services/empresa.service';

@Component({
    selector: 'app-login-empresa',
    imports: [FooterComponent, RouterModule, FormsModule],
    templateUrl: './login-empresa.component.html',
    styleUrl: './login-empresa.component.css',
    standalone: true
})
export class LoginEmpresaComponent {

    constructor(
        private authService: AuthService,
        private empresaService: EmpresaService,
        private router: Router,
    ) { }

    onSubmit(form: NgForm) {
        if (form.valid) {
            const formData = form.value;

            this.authService.login(formData, 'empresa').subscribe({
                next: (response) => {
                    localStorage.setItem('token', response.access_token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.authService.updateLoginState(true);

                    if (response.user.perfil_completo) {
                        this.router.navigate(['/companies/dashboard']);
                    } else {
                        this.router.navigate(['/companies/profile/completar']);
                    }
                },
                error: (error) => {
                    console.error(error);
                },
            });
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    }
}
