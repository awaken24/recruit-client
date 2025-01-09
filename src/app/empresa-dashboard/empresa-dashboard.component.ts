import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VagaService } from '../services/vaga.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-empresa-dashboard',
    imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
    templateUrl: './empresa-dashboard.component.html',
    styleUrl: './empresa-dashboard.component.css',
    standalone: true
})
export class EmpresaDashboardComponent {
    companyName = 'Empresa Teste';
    availableSlots = 4;
    isSidebarOpen = true;
    currentSlide = 0;
    itemsPerSlide = 3;
    isLoading: boolean = true;
    vagas: any[] = [];
    isSidebarClosed: boolean = false;

    filters = [
        { label: 'Todas', count: 1, active: true },
        { label: 'Pagamento pendente', count: 0, active: false },
        { label: 'Incompletas', count: 0, active: false },
        { label: 'Em revisão', count: 1, active: false },
        { label: 'Ativas', count: 0, active: false },
        { label: 'Desativadas', count: 0, active: false }
    ];

    constructor(private vagaService: VagaService) { }

    ngOnInit() {
        this.vagaService.getEmpresaVagas().subscribe({
            next: (response: any) => {
                if (response.status === 'success' && response.data) {
                    console.log(response.data);
                    this.vagas = response.data;
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar habilidades:', err);
                this.isLoading = false;
            }
        });
    }

    jobs = Array(10).fill(null).map((_, index) => ({
        title: `Desenvolvedor Web Fullstack ${index + 1}`,
        level: 'FULL STACK - Júnior',
        status: 'Em Revisão',
        statusMessage: 'Esperando por validação',
        description: 'Sua oferta de emprego está sendo revisada pela nossa equipe de TI para garantir os melhores resultados de matching.'
    }));

    get totalSlides(): number {
        return Math.ceil((this.vagas.length + 1) / this.itemsPerSlide);
    }

    get currentItems(): any[] {
        const start = this.currentSlide * this.itemsPerSlide;
        const allItems = [
            { isCreateCard: true },
            ...this.vagas.map(vaga => ({
                isCreateCard: false,
                title: vaga.titulo,
                level: `${vaga.perfil.toUpperCase()} - ${vaga.nivel_experiencia}`,
                status: vaga.status,
                statusMessage: this.getStatusMessage(vaga.status),
                description: vaga.descricao
            }))
        ];
        return allItems.slice(start, start + this.itemsPerSlide);
    }

    getStatusMessage(status: string): string {
        switch(status) {
            case 'ativa': return 'Vaga publicada e recebendo candidaturas';
            case 'em_revisao': return 'Esperando por validação';
            case 'desativada': return 'Vaga não está visível para candidatos';
            default: return '';
        }
    }

    nextSlide(): void {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
        }
    }

    previousSlide(): void {
        if (this.currentSlide > 0) {
            this.currentSlide--;
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}