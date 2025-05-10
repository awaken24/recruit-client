import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpresaService } from '../services/empresa.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { API_BASE_URL } from '../app.config';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-update-profile-empresa',
    imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, LoadingSpinnerComponent],
    templateUrl: './update-profile-empresa.component.html',
    styleUrl: './update-profile-empresa.component.css',
    standalone: true,
    providers: [provideNgxMask()]
})
export class UpdateProfileEmpresaComponent {
    empresaForm: FormGroup;

    logoSelecionada: File | null = null;
    logoPreviewUrl: string | null = null;
    mode: 'edit' | 'create' = 'create';
    isLoading: boolean = true;
    @ViewChild('fileInput') fileInput!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private empresaService: EmpresaService,
        private route: ActivatedRoute,
        private router: Router,
        private notifier: NotificationService
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

    ngOnInit() {
        this.mode = this.route.snapshot.data['mode'] || 'create';

        if (this.mode == 'edit') {
            const id = this.route.snapshot.params['id'];
            this.empresaService.getDataEmpresa(id).subscribe({
                next: (response) => {
                    const empresa = response.data;

                    this.empresaForm.patchValue({
                        razao_social: empresa.razao_social,
                        nome_fantasia: empresa.nome_fantasia,
                        website: empresa.website,
                        cnpj: empresa.cnpj,
                        descricao: empresa.descricao,
                        youtube_video: empresa.youtube_video,
                        tipo_empresa: empresa.tipo_empresa,
                        ano_fundacao: empresa.ano_fundacao,
                        numero_funcionarios: empresa.numero_funcionarios,
                        politica_remoto: empresa.politica_remoto || '',
                        facebook: empresa.redes_sociais?.facebook || '',
                        twitter: empresa.redes_sociais?.twitter || '',
                        linkedin: empresa.redes_sociais?.linkedin || '',
                        instagram: empresa.redes_sociais?.instagram || '',
                        tiktok: empresa.redes_sociais?.tiktok || '',
                        youtube: empresa.redes_sociais?.youtube || '',
                        endereco: empresa.endereco ? {
                            cep: empresa.endereco.cep || '',
                            logradouro: empresa.endereco.logradouro || '',
                            numero: empresa.endereco.numero || '',
                            complemento: empresa.endereco.complemento || '',
                            bairro: empresa.endereco.bairro || '',
                            cidade: empresa.endereco.cidade || '',
                            estado: empresa.endereco.estado || ''
                        } : {},
                        contato_nome: empresa.contato_nome,
                        contato_cargo: empresa.contato_cargo,
                        contato_telefone: empresa.contato_telefone,
                        como_encontrou: empresa.como_encontrou
                    });

                    this.logoPreviewUrl = empresa.logo_path ? `${API_BASE_URL}/${empresa.logo_path}` : null;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.notifier.warning(error.error.message);
                }
            });
        } else {
            this.isLoading = false;
        }
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

            if (this.mode == 'edit') {
                const id = this.route.snapshot.params['id'];
                this.empresaService.atualizarEmpresa(id, formData).subscribe({
                    next: (response) => {
                        this.notifier.success(response.message);
                        setTimeout(() => {
                            this.router.navigate(['/companies/dashboard']);
                        }, 700);
                    },
                    error: (err) => {
                        this.notifier.warning(err.error?.message || 'Erro ao atualizar perfil da empresa.');
                    }
                });
            } else {
                this.empresaService.enviarDadosEmpresa(formData).subscribe({
                    next: (response) => {
                        console.log('Dados enviados com sucesso:', response);
                        this.router.navigate(['/companies/dashboard']);
                    },
                    error: (error) => {
                        console.error('Erro ao enviar os dados:', error);
                    }
                });
            }
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
