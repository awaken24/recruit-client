import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatoService } from '../services/candidato.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

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
    imports: [CommonModule, LoadingSpinnerComponent],
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

    constructor(private candidatoService: CandidatoService) { }

    ngOnInit(): void {
        this.loadDashboardData();
        this.isLoading = false;
    }

    private loadDashboardData(): void {
        this.candidatoService.getDashboardData().subscribe({
            next: (response) => {
                if (response.status === 'success') {
                    const data = response.data;
                    this.username = data.candidato.nome;
                    this.userStats.applications = data.qtdCandidaturas;
                    this.userStats.opportunities = data.qtdOprtunidades;
                    this.tituloProfissional = data.candidato.titulo;
                }
            },
            error: (error) => {
                console.error('Erro ao carregar dados do dashboard:', error);
            }
        });
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}