import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HabilidadesService } from '../services/habilidades.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CandidatoService } from '../services/candidato.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-update-profile-candidato',
    imports: [ReactiveFormsModule, CommonModule, LoadingSpinnerComponent],
    templateUrl: './update-profile-candidato.component.html',
    styleUrl: './update-profile-candidato.component.css',
    standalone: true
})
export class UpdateProfileCandidatoComponent {

    candidatoForm: FormGroup;
    isLoading: boolean = false;

    habilidadesSelecionadas: string[] = [];
    niveisHabilidade: { [key: string]: string } = {};
    niveisExperiencia = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
    habilidadesDisponiveis: { id: number; nome: string }[] = [];

    meses = [
        { valor: '01', nome: 'Janeiro' },
        { valor: '02', nome: 'Fevereiro' },
        { valor: '03', nome: 'Março' },
        { valor: '04', nome: 'Abril' },
        { valor: '05', nome: 'Maio' },
        { valor: '06', nome: 'Junho' },
        { valor: '07', nome: 'Julho' },
        { valor: '08', nome: 'Agosto' },
        { valor: '09', nome: 'Setembro' },
        { valor: '10', nome: 'Outubro' },
        { valor: '11', nome: 'Novembro' },
        { valor: '12', nome: 'Dezembro' }
    ];

    anos = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

    constructor (
        private fb: FormBuilder, 
        private router: Router,
        private habilidadesService: HabilidadesService, 
        private candidatoService: CandidatoService, 
    ) {
        this.candidatoForm = this.fb.group({
            nome: ['', Validators.required],
            sobrenome: ['', Validators.required],
            telefone: ['', Validators.required],
            cpf: ['', Validators.required],
            titulo: ['', Validators.required],
            nivelIngles: ['', Validators.required],
            descricao: [''],
            linkedin: [''],
            github: [''],
            foco_carreira: ['', Validators.required],
            experienceLevel: ['', Validators.required],
            experiencias: this.fb.array([]),
            salario_desejo: [''],
            tipo_empresa: [''],
            tipo_contrato: [''],
            status_busca: [''],
            trabalho_remoto: [''],
            pcd: [''],
            endereco: this.fb.group({
                cep: ['', Validators.required],
                estado: ['', Validators.required],
                cidade: ['', Validators.required],
                bairro: ['', Validators.required],
                logradouro: ['', Validators.required],
                numero: ['', Validators.required],
                complemento: ['']
            })
        });
    }

    ngOnInit() {
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

    onSubmit() {
        if (this.candidatoForm.invalid) {
            console.log("Invalido");
            this.candidatoForm.markAllAsTouched();
            return;
        }

        if (this.habilidadesSelecionadas.length < 3) {
            alert('Selecione pelo menos 3 habilidades.');
            return;
        }

        const formData = {
            ...this.candidatoForm.value,
            habilidades: this.habilidadesSelecionadas.map(id => ({
                habilidade_id: Number(id),
                nivel_experiencia: this.niveisHabilidade[id]
            }))
        };

        this.candidatoService.enviarDadosCandidato(formData).subscribe({
            next: (response) => {
                console.log('Dados enviados com sucesso:', response);
                this.router.navigate(['/candidate/dashboard']);
            },
            error: (error) => {
                console.error('Erro ao enviar os dados:', error);
            }
        });
    }

    get experiencias(): FormArray {
        return this.candidatoForm.get('experiencias') as FormArray;
    }

    adicionarExperiencia(): void {
        const experienciaForm = this.fb.group({
            empresa: ['', Validators.required],
            cargo: ['', Validators.required],
            mesInicio: ['', Validators.required],
            anoInicio: ['', Validators.required],
            mesFim: [''],
            anoFim: [''],
            trabalhoAtual: [false],
            descricao: ['', Validators.required]
        });
        this.experiencias.push(experienciaForm);
    }

    removerExperiencia(index: number): void {
        this.experiencias.removeAt(index);
    }

    private validarHabilidades(): void {
        const habilidadesControl = this.candidatoForm.get('habilidadesRequeridas');
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

    onTrabalhoAtualChange(index: number): void {
        const experienciaForm = this.experiencias.at(index) as FormGroup;

        const trabalhoAtual = experienciaForm.get('trabalhoAtual')?.value;

        const mesFimControl = experienciaForm.get('mesFim');
        const anoFimControl = experienciaForm.get('anoFim');

        if (trabalhoAtual) {
            mesFimControl?.disable();
            anoFimControl?.disable();
            mesFimControl?.setValue('');
            anoFimControl?.setValue('');
        } else {
            mesFimControl?.enable();
            anoFimControl?.enable();
        }
    }

}
