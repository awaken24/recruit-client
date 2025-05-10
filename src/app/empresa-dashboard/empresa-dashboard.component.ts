import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VagaService } from '../services/vaga.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { EmpresaService } from '../services/empresa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfiguracaoEmpresaComponent } from '../configuracao-empresa/configuracao-empresa.component';
import { RouterModule } from '@angular/router';
import { API_BASE_URL } from '../app.config';

@Component({
    selector: 'app-empresa-dashboard',
    imports: [
        CommonModule,
        FormsModule,
        LoadingSpinnerComponent,
        ConfiguracaoEmpresaComponent,
        RouterModule
    ],
    templateUrl: './empresa-dashboard.component.html',
    styleUrl: './empresa-dashboard.component.css',
    standalone: true
})
export class EmpresaDashboardComponent {
    company: any;
    availableSlots = 4;
    isSidebarOpen = true;
    currentSlide = 0;
    itemsPerSlide = 3;
    isLoading: boolean = true;
    vagas: any[] = [];
    isSidebarClosed: boolean = false;
    fotoPerfil: string | null = null;
    currentRoute: string = '';

    filters = [
        { label: 'Todas', count: 1, active: true },
        // { label: 'Pagamento pendente', count: 0, active: false },
        // { label: 'Incompletas', count: 0, active: false },
        // { label: 'Em revisão', count: 1, active: false },
        { label: 'Ativas', count: 0, active: false },
        { label: 'Desativadas', count: 0, active: false }
    ];

    constructor(
        private vagaService: VagaService,
        private empresaService: EmpresaService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.router.events.subscribe(() => {
            this.currentRoute = this.router.url.split('/').pop() || '';
            console.log(this.currentRoute);
        });
    }

    onLoadingStateChanged(isLoading: boolean): void {
        this.isLoading = isLoading;
    }

    ngOnInit() {
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        this.empresaService.getDashboardData().subscribe({
            next: (response) => {
                this.company = response.data.empresa;
                this.vagas = response.data.vagas;

                if (response.data.empresa.logo_path) {
                    this.fotoPerfil = `${API_BASE_URL}/${response.data.empresa.logo_path}`;
                }
                this.isLoading = false;
            },
            error: (error) => {
                alert(error);
                console.error(error);
                this.isLoading = false;
            }
        });
    }

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
        switch (status) {
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

    navigateToNewJob() {
        this.router.navigate(['/jobs/new']);
    }

    verVaga(vaga: any) {
        this.router.navigate(['/vagas', vaga.id]);
    }

    gerenciarCandidaturas(vaga: any) {
        this.router.navigate(['/companies/vagas', vaga.id, 'candidaturas']);
    }

    desabilitarVaga(vaga: any) {
        console.log('Desabilitar vaga:', vaga.id);
    }

    editarPerfil(empresaId: any): void {
        this.router.navigate(['companies/profile/editar/', empresaId]);
    }
}
