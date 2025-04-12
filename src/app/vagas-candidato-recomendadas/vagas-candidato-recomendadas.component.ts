import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { VagaService } from '../services/vaga.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-vagas-candidato-recomendadas',
    imports: [CommonModule],
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

    constructor(private router: Router, private route: ActivatedRoute, private vagaservice: VagaService) {
        const urlSegments = this.router.url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];

        if (lastSegment === 'oportunidades' || lastSegment === 'candidaturas') {
            this.abaAtiva = lastSegment;
        }
    }

    ngOnInit() {
        this.vagaservice.getPainelVagas().subscribe({
            next: (response) => {

                this.vagasCandidatadas = response.data.candidaturas
                    .map((vaga: any) => this.mapearVaga(vaga))
                    .sort((a: any, b: any) => b.compatibilidade - a.compatibilidade); 

                this.vagasRecomendadas = response.data.oportunidades
                    .map((vaga: any) => this.mapearVaga(vaga))
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
        console.log(`Candidatura enviada para a vaga ${jobId}`);
    }

    recusar(jobId: number): void {
        console.log(`Vaga ${jobId} recusada`);
    }

    verDetalhes(vagaId: number): void {
        this.router.navigate(['/vagas', vagaId]);
    }
}
