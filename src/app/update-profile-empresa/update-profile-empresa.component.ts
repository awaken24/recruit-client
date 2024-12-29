import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpresaService } from '../services/empresa.service';

@Component({
    selector: 'app-update-profile-empresa',
    imports: [ReactiveFormsModule],
    templateUrl: './update-profile-empresa.component.html',
    styleUrl: './update-profile-empresa.component.css',
    standalone: true
})
export class UpdateProfileEmpresaComponent {
    empresaForm: FormGroup;

    constructor(private fb: FormBuilder, private empresaService: EmpresaService) {
        this.empresaForm = this.fb.group({
            razao_social: ['', Validators.required],
            nome_fantasia: ['', Validators.required],
            website: [''],
            cnpj: ['', Validators.required],
            sem_cnpj: [false],
            descricao: ['', Validators.required],
            youtube_video: [''],
            tipo_empresa: [''],
            ano_fundacao: [''],
            numero_funcionarios: [''],
            politica_remoto: [''],
            // averageAge: [''],
            // malePercentage: [50],
            // femalePercentage: [50],
            facebook: [''],
            twitter: [''],
            linkedin: [''],
            instagram: [''],
            tiktok: [''],
            youtube: [''],
            endereco: this.fb.group({
                cep: ['', Validators.required],
                logradouro: ['', Validators.required],
                numero: ['', Validators.required],
                complemento: [''],
                bairro: ['', Validators.required],
                cidade: ['', Validators.required],
                estado: ['', Validators.required]
            }),
            contato_nome: ['', Validators.required],
            contato_cargo: ['', Validators.required],
            contato_telefone: ['', Validators.required],
            como_encontrou: ['', Validators.required],
        });
    }

    onSubmit(): void {
        if (this.empresaForm.valid) {
            const dados = this.empresaForm.value;
            this.empresaService.enviarDadosEmpresa(dados).subscribe({
                next: (response) => {
                    console.log('Dados enviados com sucesso:', response);
                },
                error: (error) => {
                    console.error('Erro ao enviar os dados:', error);
                }
            });
        } else {
            console.log('Formulário inválido');
        }
    }
}
