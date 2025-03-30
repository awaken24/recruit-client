import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { HabilidadesService } from '../services/habilidades.service';
import { VagaService } from '../services/vaga.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cadastro-vaga',
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
    templateUrl: './cadastro-vaga.component.html',
    styleUrl: './cadastro-vaga.component.css',
    standalone: true
})
export class CadastroVagaComponent {
    jobForm!: FormGroup;
    isLoading: boolean = false;
    isPresencialOrHibrido: boolean = false;

    hoje: string = "";
    maxDate: string = "";

    habilidadesSelecionadas: string[] = [];
    niveisHabilidade: { [key: string]: string } = {};
    habilidadesDisponiveis: { id: number; nome: string }[] = [];

    niveisExperiencia = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
    niveisExperienciaExibicao = ['0-1 anos', '1-2 anos', '2-3 anos', '3-4 anos', '4-5 anos', '5+ anos'];

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

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private habilidadesService: HabilidadesService, 
        private vagaService: VagaService
    ) {
        this.initializeForm();
    }

    ngOnInit() {

        const today = new Date();
        const max = new Date();
        max.setDate(today.getDate() + 60);

        this.hoje = this.formatDate(today);
        this.maxDate = this.formatDate(max);

        this.isLoading = true;
        this.habilidadesService.getHabilidades().subscribe({
            next: (response: any) => {
                if (response.status === 'success' && response.data) {
                    this.habilidadesDisponiveis = response.data;
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar habilidades:', err);
                this.isLoading = false;
            }
        });
    }

    private initializeForm() {
        const defaultValues = {
            title: ['', Validators.required],
            profile: ['', Validators.required],
            experienceLevel: ['', Validators.required],
            descricao: ['', Validators.required],
            // requisitos: ['', Validators.required],
            modelo_trabalho: ['', Validators.required],
            endereco_trabalho: [''],
            cidade_trabalho: [''],
            comentarios_hibrido: [''],
            tipo_contrato: ['', Validators.required],
            faixa_salarial: ['', Validators.required],
            divulgar_salario: [false],
            receberCandidaturasAte: [null, [Validators.required, this.receberCandidaturasValidator]],
            beneficios: this.fb.group(
                {
                    vale_refeicao: [false],
                    vale_alimentacao: [false],
                    vale_transporte: [false],
                    plano_saude: [false],
                    plano_odontologico: [false],
                    seguro_vida: [false],
                    vale_estacionamento: [false],
                    academia_gympass: [false],
                    bonus: [false],
                }
            ),
        };

        this.jobForm = this.fb.group(defaultValues);

        this.setupFormListeners();
    }

    private setupFormListeners() {
        this.jobForm.get('modelo_trabalho')?.valueChanges.subscribe(value => {
            this.isPresencialOrHibrido = value === 'presencial_hibrido';
            this.updateValidations();
        });
    }

    onSubmit() {
        if (this.jobForm.invalid || this.habilidadesSelecionadas.length < 3) {
            this.markFormAsTouched();
            return;
        }

        const dadosParaEnvio = this.prepareFormData();
        this.isLoading = true;

        this.vagaService.registrarVaga(dadosParaEnvio).subscribe({
            next: (response) => {
                console.log('Vaga registrada com sucesso:', response);
                this.router.navigate(['candidate/dashboard']);
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Erro ao registrar vaga:', error);
            }
        });
    }

    private prepareFormData() {
        const habilidadesRequeridas = this.habilidadesSelecionadas.map(habilidadeId => ({
            habilidade_id: Number(habilidadeId),
            nivel_experiencia: this.niveisHabilidade[habilidadeId],
        }));

        const formData = { ...this.jobForm.value };

        if (formData.modelo_trabalho === 'remoto') {
            ['endereco_trabalho', 'cidade_trabalho', 'comentarios_hibrido'].forEach(
                field => delete formData[field]
            );
        }
        const beneficiosSelecionados = Object.entries(formData.beneficios || {}).filter(([_, value]) => value).map(([key]) => key);

        return {
            ...formData,
            beneficios: beneficiosSelecionados,
            habilidadesRequeridas,
        };
    }

    private markFormAsTouched() {
        Object.keys(this.jobForm.controls).forEach(key => {
            const control = this.jobForm.get(key);
            if (control) control.markAsTouched();
        });
    }

    private validarHabilidades(): void {
        const habilidadesControl = this.jobForm.get('habilidadesRequeridas');
        if (habilidadesControl) {
            if (this.habilidadesSelecionadas.length < 3) {
                habilidadesControl.setErrors({ 'minSkills': true });
            } else {
                habilidadesControl.setErrors(null);
            }
            if (habilidadesControl.touched) {
                habilidadesControl.markAsTouched();
            }
        }
    }

    removerHabilidade(habilidadeParaRemover: string): void {
        this.habilidadesSelecionadas = this.habilidadesSelecionadas.filter(
            habilidade => habilidade !== habilidadeParaRemover
        );
        delete this.niveisHabilidade[habilidadeParaRemover];
        this.validarHabilidades();
    }

    atualizarNivelHabilidade(habilidade: string, nivel: string): void {
        this.niveisHabilidade[habilidade] = nivel;
    }


    onWorkModelChange(event: any): void {
        const selectedValue = event.target.value;
        this.isPresencialOrHibrido = selectedValue === 'presencial_hibrido';
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


    adicionarHabilidade(evento: any): void {
        const habilidadeId = evento.target.value;
        if (habilidadeId && this.habilidadesSelecionadas.length < 6 && !this.habilidadesSelecionadas.includes(habilidadeId)) {
            const habilidade = this.habilidadesDisponiveis.find(h => h.id === Number(habilidadeId));
            if (habilidade) {
                this.habilidadesSelecionadas.push(habilidadeId);
                this.niveisHabilidade[habilidadeId] = '';
                this.validarHabilidades();
            }
        }

        console.log(this.habilidadesSelecionadas);
        evento.target.value = '';
    }

    habilidadeSelecionada(habilidadeId: number): boolean {
        return this.habilidadesSelecionadas.includes(String(habilidadeId));
    }

    getHabilidadeNome(id: string): string {
        const habilidade = this.habilidadesDisponiveis.find(h => h.id === Number(id));
        return habilidade ? habilidade.nome : '';
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    receberCandidaturasValidator(control: AbstractControl) {
        const selectedDate = new Date(control.value);
        const today = new Date();
        const max = new Date();
        max.setDate(today.getDate() + 60);

        if (selectedDate > max) {
            return { dataInvalida: true };
        }
        return null;
    }
}
