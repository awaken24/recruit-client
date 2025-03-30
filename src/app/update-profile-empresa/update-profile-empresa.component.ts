import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpresaService } from '../services/empresa.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';

@Component({
    selector: 'app-update-profile-empresa',
    imports: [ReactiveFormsModule, NgxMaskDirective],
    templateUrl: './update-profile-empresa.component.html',
    styleUrl: './update-profile-empresa.component.css',
    standalone: true,
    providers: [provideNgxMask()]
})
export class UpdateProfileEmpresaComponent {
    empresaForm: FormGroup;

    logoSelecionada: File | null = null;
    logoPreviewUrl: string | null = null;
    @ViewChild('fileInput') fileInput!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private empresaService: EmpresaService,
    ) {
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
            const formData = new FormData();

            Object.keys(this.empresaForm.value).forEach(key => {
                const value = this.empresaForm.get(key)?.value;

                if (key === 'endereco') {
                    Object.keys(value).forEach(subKey => {
                        formData.append(`endereco[${subKey}]`, value[subKey]);
                    });
                } else {
                    formData.append(key, value);
                }
            });

            if (this.logoSelecionada) {
                formData.append('logo', this.logoSelecionada, this.logoSelecionada.name);
            }

            this.empresaService.enviarDadosEmpresa(formData).subscribe({
                next: (response) => {
                    console.log('Dados enviados com sucesso:', response);
                    this.router.navigate(['/companies/dashboard']);
                },
                error: (error) => {
                    console.error('Erro ao enviar os dados:', error);
                }
            });
        } else {
            console.log('Formulário inválido');
        }
    }

    onLogoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.logoSelecionada = file;

            console.log('Logo selecionada:', file);

            const reader = new FileReader();
            reader.onload = () => {
                this.logoPreviewUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
}
