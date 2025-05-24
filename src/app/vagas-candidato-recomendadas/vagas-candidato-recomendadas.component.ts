import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { VagaService } from '../services/vaga.service';
import { Output, EventEmitter } from '@angular/core';
import { CandidatoService } from '../services/candidato.service';
import { NotificationService } from '../shared/notification.service';

@Component({
    selector: 'app-vagas-candidato-recomendadas',
    imports: [CommonModule, RouterModule],
    templateUrl: './vagas-candidato-recomendadas.component.html',
    styleUrl: './vagas-candidato-recomendadas.component.css',
    standalone: true
})
export class VagasCandidatoRecomendadasComponent {
    Math = Math;
    abaAtiva: 'oportunidades' | 'candidaturas' = 'oportunidades';
    itensPorPagina: number = 6;
    isLoading: boolean = true;
    @Output() loadingStateChanged = new EventEmitter<boolean>();

    paginaAtualRecomendadas: number = 1;
    totalPaginasRecomendadas: number = 1;
    vagasRecomendadasPaginadas: any[] = [];
    paginasRecomendadas: number[] = [];

    paginaAtualCandidatadas: number = 1;
    totalPaginasCandidatadas: number = 1;
    vagasCandidatadasPaginadas: any[] = [];
    paginasCandidatadas: number[] = [];

    vagasRecomendadas: any[] = [];
    vagasCandidatadas: any[] = [];

    processingVagas: number[] = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private vagaservice: VagaService,
        private candidatoService: CandidatoService,
        private notifier: NotificationService
    ) {
        const urlSegments = this.router.url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];

        if (lastSegment === 'oportunidades' || lastSegment === 'candidaturas') {
            this.abaAtiva = lastSegment;
        }
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                location.reload();
            }
        });

        this.vagaservice.getPainelVagas().subscribe({
            next: (response) => {

                this.vagasCandidatadas = response.data.candidaturas
                    .map((vaga: any) => this.mapearVaga(vaga))
                    .sort((a: any, b: any) => b.compatibilidade - a.compatibilidade);

                this.vagasRecomendadas = response.data.oportunidades
                    .map((oportunidade: any) => this.mapearOportunidade(oportunidade))
                    .sort((a: any, b: any) => b.compatibilidade - a.compatibilidade);

                this.atualizarPaginacaoRecomendadas();
                this.atualizarPaginacaoCandidatadas();
                this.loadingStateChanged.emit(this.isLoading = false);
            },
            error: (error) => {
                this.loadingStateChanged.emit(this.isLoading = false);
                console.error('Erro ao carregar painel de vagas:', error);
            }
        });

        if (this.abaAtiva === 'oportunidades') {
            this.atualizarPaginacaoRecomendadas();
        } else {
            this.atualizarPaginacaoCandidatadas();
        }
    }

    mapearVaga(vaga: any) {
        console.log(vaga);
        return {
            id: vaga.vaga.id,
            company: vaga.vaga.empresa.nome_fantasia,
            title: vaga.vaga.titulo,
            location: vaga.vaga.modelo_trabalho,
            companySize: this.formatarTamanhoEmpresa(vaga.vaga.empresa.tipo_empresa),
            level: this.formatarNivel(vaga.vaga.nivel_experiencia),
            contractType: this.formatarTipoContrato(vaga.vaga.tipo_contrato),
            skills: vaga.habilidades?.map((h: any) => h.nome) || [],
            matchPercentage: vaga.compatibilidade || 0,
            status: vaga.status || 'Em análise',
            dataCandidatura: vaga.created_at ? this.formatarData(vaga.created_at) : 'Data não informada'
        };
    }

    mapearOportunidade(oportunidade: any) {
        return {
            id: oportunidade.id,
            vagaId: oportunidade.vaga_id,
            company: oportunidade.vaga?.empresa?.nome_fantasia || 'Empresa não informada',
            title: oportunidade.vaga?.titulo || 'Vaga não encontrada',
            location: oportunidade.vaga?.modelo_trabalho || 'Local não informado',
            companySize: this.formatarTamanhoEmpresa(oportunidade.vaga?.empresa?.tipo_empresa),
            level: this.formatarNivel(oportunidade.vaga?.nivel_experiencia),
            contractType: this.formatarTipoContrato(oportunidade.vaga?.tipo_contrato),
            skills: oportunidade.habilidades?.map((h: any) => h.nome) || [],
            matchPercentage: oportunidade.compatibilidade || 0,
            status: oportunidade.status || 'Oportunidade disponível',
            oportunidadeId: oportunidade.id
        };
    }

    formatarData(dataString: string): string {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }

    formatarTamanhoEmpresa(tipo: string): string {
        const tipos: any = {
            'pequena_media': 'Pequena/Média',
            'startup': 'Startup',
            'grande': 'Grande'
        };
        return tipos[tipo] || tipo;
    }

    formatarNivel(nivel: string): string {
        const niveis: any = {
            'junior': 'Júnior',
            'pleno': 'Pleno',
            'senior': 'Sênior'
        };
        return niveis[nivel] || nivel;
    }

    formatarTipoContrato(tipo: string): string {
        const tipos: any = {
            'clt': 'CLT',
            'pj': 'PJ',
            'estagio': 'Estágio'
        };
        return tipos[tipo] || tipo;
    }

    atualizarPaginacaoRecomendadas() {
        this.calcularTotalPaginasRecomendadas();
        this.atualizarVagasRecomendadasPaginadas();
        this.gerarPaginasRecomendadas();
    }

    calcularTotalPaginasRecomendadas(): void {
        this.totalPaginasRecomendadas = Math.ceil(this.vagasRecomendadas.length / this.itensPorPagina);
    }

    atualizarVagasRecomendadasPaginadas(): void {
        const inicio = (this.paginaAtualRecomendadas - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        this.vagasRecomendadasPaginadas = this.vagasRecomendadas.slice(inicio, fim);
    }

    gerarPaginasRecomendadas(): void {
        this.paginasRecomendadas = Array.from({ length: this.totalPaginasRecomendadas }, (_, i) => i + 1);
    }

    mudarPaginaRecomendadas(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPaginasRecomendadas) {
            this.paginaAtualRecomendadas = pagina;
            this.atualizarVagasRecomendadasPaginadas();
        }
    }

    atualizarPaginacaoCandidatadas(): void {
        this.calcularTotalPaginasCandidatadas();
        this.atualizarVagasCandidatadasPaginadas();
        this.gerarPaginasCandidatadas();
    }

    calcularTotalPaginasCandidatadas(): void {
        this.totalPaginasCandidatadas = Math.ceil(this.vagasCandidatadas.length / this.itensPorPagina);
    }

    atualizarVagasCandidatadasPaginadas(): void {
        const inicio = (this.paginaAtualCandidatadas - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        this.vagasCandidatadasPaginadas = this.vagasCandidatadas.slice(inicio, fim);
    }

    gerarPaginasCandidatadas(): void {
        this.paginasCandidatadas = Array.from({ length: this.totalPaginasCandidatadas }, (_, i) => i + 1);
    }

    mudarPaginaCandidatadas(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPaginasCandidatadas) {
            this.paginaAtualCandidatadas = pagina;
            this.atualizarVagasCandidatadasPaginadas();
        }
    }

    mudarAba(aba: 'oportunidades' | 'candidaturas'): void {
        this.abaAtiva = aba;
    }

    candidatar(jobId: number): void {
        if (this.processingVagas.includes(jobId)) {
            return
        };

        this.processingVagas.push(jobId);

        this.candidatoService.aproveitarOportunidade(jobId).subscribe({
            next: (response) => {
                this.notifier.success(response.message);
            },
            error: (err) => {
                this.notifier.warning(err.error.message);
            },
            complete: () => {
                this.processingVagas = this.processingVagas.filter(id => id !== jobId);
                setTimeout(() => {
                    this.router.navigate(['/candidate/dashboard/candidaturas']);
                }, 800);
            }
        });
    }

    recusar(oportunidadeId: number): void {
        this.candidatoService.recusarOportunidade(oportunidadeId).subscribe({
            next: (response) => {
                this.vagasRecomendadas = this.vagasRecomendadas.filter(vaga => 
                    vaga.oportunidadeId !== oportunidadeId
                );
                this.atualizarPaginacaoRecomendadas();

                this.notifier.success(response.message);
            },
            error: (err) => {
                this.notifier.warning(err.error.message);
            },
            complete: () => {
                this.processingVagas = this.processingVagas.filter(id => id !== oportunidadeId);
            }
        });
    }

    verDetalhes(vagaId: number): void {
        this.router.navigate(['/vagas', vagaId]);
    }

    isProcessing(jobId: number): boolean {
        return this.processingVagas.includes(jobId);
    }
}
