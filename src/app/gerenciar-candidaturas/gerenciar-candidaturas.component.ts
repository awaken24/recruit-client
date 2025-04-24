import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VagaService } from '../services/vaga.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FooterComponent } from '../footer/footer.component';
import { NotificationService } from '../shared/notification.service';

@Component({
    selector: 'app-gerenciar-candidaturas',
    imports: [CommonModule, FormsModule, LoadingSpinnerComponent, FooterComponent],
    templateUrl: './gerenciar-candidaturas.component.html',
    styleUrl: './gerenciar-candidaturas.component.css',
    standalone: true
})
export class GerenciarCandidaturasComponent {
    vaga: any;
    vagaId: string | null = null;
    candidatos: any[] = [];
    isLoading: boolean = true;
    candidatosFiltrados: any[] = [];
    filtroSelecionado: string = 'todos';
    termoBusca: string = '';

    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalPages: number = 1;

    Math = Math;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private vagaService: VagaService,
        private notifier: NotificationService
    ) { }

    ngOnInit() {
        this.vagaId = this.route.snapshot.paramMap.get('id');

        if (this.vagaId) {
            this.vagaService.gerenciarVaga(this.vagaId).subscribe({
                next: (response) => {
                    this.candidatos = response.data.candidaturas.map((candidatura: any) => ({
                        id: candidatura.id,
                        status: candidatura.status,
                        percentualMatch: candidatura.compatibilidade || 0,
                        candidato: {
                            id: candidatura.candidato.id,
                            nome: `${candidatura.candidato.nome} ${candidatura.candidato.sobrenome}`,
                            titulo: candidatura.candidato.titulo,
                            skills: candidatura.candidato.habilidades.map((h: any) => h.nome),
                            resumo: candidatura.candidato.descricao,
                            foto: candidatura.candidato.foto_path 
                                ? `http://127.0.0.1:8000/${candidatura.candidato.foto_path}`
                                : null
                        }
                    }))
                    .sort((a: any , b: any) => b.percentualMatch - a.percentualMatch);

                    this.vaga = response.data;
                    this.isLoading = false;
                    this.candidatosFiltrados = this.candidatos;
                    this.totalPages = Math.ceil(this.candidatosFiltrados.length / this.itemsPerPage);
                },
                error: (err) => {
                    console.error('Erro ao carregar candidaturas:', err);
                    this.isLoading = false;
                }
            });
        }
    }

    formatarSalario(salario: string): string {
        if (!salario) {
            return '';
        }

        const [min, max] = salario.split('-');

        const formatarValor = (valor: string) => {
            const numero = parseFloat(valor.trim());
            return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        return `${formatarValor(min)} - ${formatarValor(max)}`;
    }

    filtrarCandidatos() {
        let filtrados = this.candidatos;

        if (this.filtroSelecionado !== 'todos') {
            filtrados = filtrados.filter(c => c.status === this.filtroSelecionado);
        }

        if (this.termoBusca.trim() !== '') {
            const termo = this.termoBusca.toLowerCase();
            filtrados = filtrados.filter(candidatos =>
                candidatos.candidato.nome.toLowerCase().includes(termo)
            );
        }

        this.candidatosFiltrados = filtrados;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.candidatosFiltrados.length / this.itemsPerPage);
    }

    get candidatosPaginados() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.candidatosFiltrados.slice(start, end);
    }

    mudarPagina(pagina: number) {
        this.currentPage = pagina;
    }

    contarPorStatus(status: string): number {
        return this.candidatos.filter(candidatura => candidatura.status === status).length;
    }


    verPerfil(candidatoId: any) {
        this.router.navigate(['/candidato/profile', candidatoId]);
    }

    aprovarCandidato(candidatura: any) {
        this.vagaService.aprovarCandidatura(candidatura.id).subscribe({
            next: (response) => {
                candidatura.status = 'aprovada';
                this.notifier.success(response.message);
            },
            error: (error) => {
                this.notifier.warning(error.message);
            }
        });
    }

    reprovarCandidato(candidatura: any) {
        this.vagaService.reprovarCandidatura(candidatura.id).subscribe( {
            next: (response) => {
                candidatura.status = 'reprovada';
                this.notifier.success(response.message);
            },
            error: (error) => {
                this.notifier.info(error.message);
            }
        });
    }

    getMatchClass(percentual: number): string {
        if (percentual >= 75) {
            return 'high';
        } else if (percentual >= 50) {
            return 'medium';
        } else {
            return 'low';
        }
    }
}