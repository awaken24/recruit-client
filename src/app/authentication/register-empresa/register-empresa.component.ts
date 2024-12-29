import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-empresa',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, FooterComponent],
    templateUrl: './register-empresa.component.html',
    styleUrl: './register-empresa.component.css'
})
export class RegisterEmpresaComponent implements OnInit {
    registerForm!: FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.email
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/)
            ]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    passwordMatchValidator(group: FormGroup) {
        const password = group.get('password');
        const confirmPassword = group.get('confirmPassword');

        return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMismatch: true };
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        if (this.registerForm.invalid) {
            return;
        }

        const formData = this.registerForm.value;
        this.authService.register(formData, 'empresa').subscribe({
            next: (response) => {
                console.log('Registro bem-sucedido:', response);

                if (response.data?.token) {
                    console.log("Entrou");
                    localStorage.setItem('token', response.data.token);
                    if (response.data.user) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                    this.authService.updateLoginState(true);
                    console.log('Usuário autenticado e token salvo!');
                }

                this.router.navigate(['/companies/updateProfile']);
            },
            error: (error) => {
                console.error('Erro no registro da empresa:', error);
            }
        });
    }
}