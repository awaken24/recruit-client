import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';


@Component({
    selector: 'app-register-candidato',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, FooterComponent],
    templateUrl: './register-candidato.component.html',
    styleUrl: './register-candidato.component.css'
})
export class RegisterCandidatoComponent implements OnInit {
    registerForm!: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

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

        this.authService.register(formData, 'candidato').subscribe({
            next: (response) => {
                console.log('Registro bem-sucedido:', response);

            },
            error: (error) => {
                console.error('Erro no registro do candidato:', error);

            }
        });
    }
}