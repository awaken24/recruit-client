import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../services/empresa.service';
import { NotificationService } from '../shared/notification.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-configuracao-empresa',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './configuracao-empresa.component.html',
    styleUrl: './configuracao-empresa.component.css',
    standalone: true
})
export class ConfiguracaoEmpresaComponent implements OnInit {
    empresaForm!: FormGroup;
    isLoading: boolean = true;
    @Output() loadingStateChanged = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private empresaService: EmpresaService,
        private notifier: NotificationService
    ) { }

    ngOnInit() {
        this.inicializarFormulario();
        this.carregarConfiguracoes();
    }

    inicializarFormulario(): void {
        this.empresaForm = this.fb.group({
            whatsapp_ativo: ['nao'],
            whatsapp_token: [''],
            whatsapp_instance: [''],
            whatsapp_template: [''],
            whatsapp_security_token: [''],
        });
    }

    carregarConfiguracoes(): void {
        this.empresaService.getCompanyConfig().subscribe({
            next: (resposta) => {
                if (resposta.status === 'success' && resposta.data) {
                    const config = resposta.data;
                    this.empresaForm.patchValue({
                        whatsapp_ativo: config.whatsapp_ativo ? 'sim' : 'nao',
                        whatsapp_token: config.whatsapp_token || '',
                        whatsapp_instance: config.whatsapp_instance || '',
                        whatsapp_template: config.whatsapp_template || '',
                        whatsapp_security_token: config.whatsapp_security_token || ''
                    });
                    this.loadingStateChanged.emit(this.isLoading = false);
                }
            },
            error: (error) => {
                this.notifier.warning(error.message);
                this.loadingStateChanged.emit(this.isLoading = false);
                console.error('Erro ao carregar configurações:', error);
            }
        });
    }

    salvarConfiguracoes(): void {
        if (this.empresaForm.valid) {

            const formValues = this.empresaForm.value;
            const payload = {
                whatsapp_ativo: formValues.whatsapp_ativo === 'sim',
                whatsapp_token: formValues.whatsapp_token,
                whatsapp_instance: formValues.whatsapp_instance,
                whatsapp_template: formValues.whatsapp_template,
                whatsapp_security_token: formValues.whatsapp_security_token
            };

            this.empresaService.salvarConfiguracao(payload).subscribe({
                next: (response: any) => {
                    this.notifier.success(response.message);
                },
                error: (error: any) => {
                    this.notifier.warning(error.message);
                }
            });
        } else {
            this.marcarCamposComoTocados();
        }
    }

    private marcarCamposComoTocados(): void {
        Object.keys(this.empresaForm.controls).forEach(campo => {
            const control = this.empresaForm.get(campo)!;
            control.markAsTouched();
        });
    }

    get mostrarCamposWhatsapp(): boolean {
        return this.empresaForm.get('whatsapp_ativo')!.value === 'sim';
    }
}
