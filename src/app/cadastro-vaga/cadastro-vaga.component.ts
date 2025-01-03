import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-cadastro-vaga',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cadastro-vaga.component.html',
    styleUrl: './cadastro-vaga.component.css',
    standalone: true
})
export class CadastroVagaComponent {
    jobForm!: FormGroup;
    selectedSkills: string[] = [];
    isPresencialOrHibrido: boolean = false;
    experienceLevels = ['Júnior', 'Pleno', 'Sênior'];
    availableSkills = ['ABAP', 'Administrador de sistema', 'AdonisJS', 'Angular', 'NodeJS'];
    beneficios = [
        { id: 'vale_refeicao', label: 'Vale Refeição' },
        { id: 'vale_alimentacao', label: 'Vale Alimentação' },
        { id: 'vale_transporte', label: 'Vale Transporte' },
        { id: 'plano_saude', label: 'Plano de Saúde' },
        { id: 'plano_odontologico', label: 'Plano Odontológico' },
        { id: 'seguro_vida', label: 'Seguro de Vida' },
        { id: 'vale_estacionamento', label: 'Vale Estacionamento' },
        { id: 'academia_gympass', label: 'Academia/Gympass' },
        { id: 'bonus', label: 'Bônus' }
    ];

    constructor(private fb: FormBuilder) {
        this.initializeForm();
    }

    private initializeForm() {
        this.jobForm = this.fb.group({
            title: ['', Validators.required],
            profile: ['', Validators.required],
            experienceLevel: ['', Validators.required],
            requiredSkills: [[], [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(6)
            ]],
            descricao: ['', Validators.required],
            requisitos: ['', Validators.required],
            modelo_trabalho: ['', Validators.required],
            endereco_trabalho: [''],
            cidade_trabalho: [''],
            comentarios_hibrido: [''],
            tipo_contrato: ['', Validators.required],
            faixa_salarial: ['', Validators.required],
            divulgar_salario: [''],
            beneficios: this.fb.group({
                vale_refeicao: [false],
                vale_alimentacao: [false],
                vale_transporte: [false],
                plano_saude: [false],
                plano_odontologico: [false],
                seguro_vida: [false],
                vale_estacionamento: [false],
                academia_gympass: [false],
                bonus: [false]
            })
        });

        this.jobForm.get('modelo_trabalho')?.valueChanges.subscribe(value => {
            this.isPresencialOrHibrido = value === 'presencial_hibrido';
            this.updateValidations();
        });
    }

    private updateValidations() {
        const enderecoControl = this.jobForm.get('endereco_trabalho');
        const cidadeControl = this.jobForm.get('cidade_trabalho');
        const comentariosControl = this.jobForm.get('comentarios_hibrido');

        if (this.isPresencialOrHibrido) {
            enderecoControl?.setValidators([Validators.required]);
            cidadeControl?.setValidators([Validators.required]);
        } else {
            enderecoControl?.clearValidators();
            cidadeControl?.clearValidators();
            comentariosControl?.clearValidators();
        }

        enderecoControl?.updateValueAndValidity();
        cidadeControl?.updateValueAndValidity();
        comentariosControl?.updateValueAndValidity();
    }

    onSubmit() {
        if (this.jobForm.valid) {

            console.log(this.jobForm.value);
        
        } else {
            Object.keys(this.jobForm.controls).forEach(key => {
                const control = this.jobForm.get(key);
                control?.markAsTouched();
            });
            return;
        }
    }

    onWorkModelChange(event: any): void {
        const selectedValue = event.target.value;
        this.isPresencialOrHibrido = selectedValue === 'presencial_hibrido';
    }

    addSkill(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (value && !this.selectedSkills.includes(value)) {
            this.selectedSkills.push(value);
            this.jobForm.get('requiredSkills')?.setValue(this.selectedSkills);
            this.jobForm.get('requiredSkills')?.markAsTouched();
        }
        (event.target as HTMLSelectElement).value = 'default';
    }

    removeSkill(skill: string): void {
        this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
        this.jobForm.get('requiredSkills')?.setValue(this.selectedSkills);
        this.jobForm.get('requiredSkills')?.markAsTouched();
    }

    isSkillSelected(skill: string): boolean {
        return this.selectedSkills.includes(skill);
    }

    isSkillsValid(): boolean {
        return this.selectedSkills.length >= 3 && this.selectedSkills.length <= 6;
    }

    getErrorMessage(fieldName: string): string {
        const control = this.jobForm.get(fieldName);
        if (control?.errors) {
            if (control.errors['required']) {
                return 'Este campo é obrigatório';
            }
            if (control.errors['minlength']) {
                return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
            }
            if (control.errors['minSkills']) {
                return 'Selecione pelo menos 3 habilidades';
            }
        }
        return '';
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.jobForm.get(fieldName);
        return field ? (field.invalid && (field.dirty || field.touched)) : false;
    }
}
