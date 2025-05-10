import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatoService } from '../services/candidato.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { VagasCandidatoRecomendadasComponent } from '../vagas-candidato-recomendadas/vagas-candidato-recomendadas.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ConfiguracaoCandidatoComponent } from '../configuracao-candidato/configuracao-candidato.component';
import { API_BASE_URL } from '../app.config';

interface Skill {
    name: string;
    level: string;
    iconBg: string;
    featured?: boolean;
}

interface UserStats {
    opportunities: number;
    applications: number;
}

@Component({
    selector: 'app-candidato-dashboard',
    imports: [
        CommonModule, 
        LoadingSpinnerComponent, 
        VagasCandidatoRecomendadasComponent, 
        ConfiguracaoCandidatoComponent, 
        RouterModule
    ],
    templateUrl: './candidato-dashboard.component.html',
    styleUrl: './candidato-dashboard.component.css',
    standalone: true
})
export class CandidatoDashboardComponent implements OnInit {
    username: string = '';
    profileCompletion: number = 97;
    isMobileMenuOpen: boolean = false;
    isSidebarOpen = true;
    isSidebarClosed: boolean = false;
    isLoading: boolean = true;
    fotoPerfil: string | null = null;
    currentRoute: string = '';
    candidato: any = null;

    userStats: UserStats = {
        opportunities: 0,
        applications: 0
    };

    tituloProfissional: string = '';

    programmingSkills: Skill[] = [
        { name: 'CSS', level: 'Júnior', iconBg: '#2965f1' },
        { name: 'PHP', level: 'Pleno', iconBg: '#777bb3', featured: true },
        { name: 'JavaScript', level: 'Pleno', iconBg: '#f7df1e' },
        { name: 'Python', level: 'Pleno', iconBg: '#306998' }
    ];

    certificateSkills: Skill[] = [
        { name: 'Inglês Certificação EF SET', level: 'Obter meu certificado', iconBg: '#ff9f43' }
    ];

    constructor(
        private candidatoService: CandidatoService,
        private router: Router,
        private route: ActivatedRoute
    ) { 
        this.router.events.subscribe(() => {
            this.currentRoute = this.router.url.split('/').pop() || '';
        });
    }

    onLoadingStateChanged(isLoading: boolean): void {
        this.isLoading = isLoading;
    }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        this.candidatoService.getDashboardData().subscribe({
            next: (response) => {
                if (response.status === 'success') {
                    const data = response.data;
                    this.candidato = data.candidato;
                    // this.username = data.candidato.nome;
                    this.userStats.applications = data.qtdCandidaturas;
                    this.userStats.opportunities = data.qtdOprtunidades;
                    this.tituloProfissional = data.candidato.titulo;

                    if (data.candidato.foto_perfil) {
                        this.fotoPerfil = `${API_BASE_URL}/${data.candidato.foto_perfil}`;
                    }
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar dados do dashboard:', error);
                this.isLoading = false;
            }
        });
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    editarPerfil(candidatoId: any): void {
        this.router.navigate(['candidate/profile/editar/', candidatoId]);
    }
}