import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../shared/notification.service';
import { CandidatoService } from '../services/candidato.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-configuracao-candidato',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './configuracao-candidato.component.html',
    styleUrl: './configuracao-candidato.component.css',
    standalone: true
})
export class ConfiguracaoCandidatoComponent {

    candidatoForm: FormGroup;
    isLoading: boolean = true;
    @Output() loadingStateChanged = new EventEmitter<boolean>();

    constructor(
        private fb: FormBuilder,
        private candidatoService: CandidatoService,
        private notifier: NotificationService
    ) {
        this.candidatoForm = this.fb.group({
            notificacoes_email: [true],
            notificacoes_whatsapp: [false],
            receber_alertas_vagas: [true]
        });
    }

    ngOnInit(): void {
        this.carregarConfiguracoes();
    }

    carregarConfiguracoes(): void {
        this.candidatoService.getCandidatoConfig().subscribe({
            next: (resposta) => {
                if (resposta.status === 'success' && resposta.data) {
                    const config = resposta.data;
                    this.candidatoForm.patchValue({
                        notificacoes_email: !!config.notificacoes_email,
                        notificacoes_whatsapp: !!config.notificacoes_whatsapp,
                        receber_alertas_vagas: !!config.receber_alertas_vagas
                    });
                    this.loadingStateChanged.emit(this.isLoading = false);
                }
            },
            error: (erro) => {
                this.notifier.warning('Erro ao carregar configurações');
                console.error(erro);
                this.loadingStateChanged.emit(this.isLoading = false);
            }
        });
    }

    marcarCamposComoTocados(): void {
        Object.values(this.candidatoForm.controls).forEach(control => {
            control.markAsTouched();
        });
    }

    salvarConfiguracoes(): void {
        if (this.candidatoForm.valid) {
            this.candidatoService.salvarConfiguracao(this.candidatoForm.value).subscribe({
                next: (res) => {
                    this.notifier.success(res.message || 'Preferências salvas com sucesso.');
                },
                error: (erro) => {
                    this.notifier.warning(erro.message || 'Erro ao salvar preferências.');
                    console.error(erro);
                }
            });
        } else {
            this.marcarCamposComoTocados();
        }
    }

}
