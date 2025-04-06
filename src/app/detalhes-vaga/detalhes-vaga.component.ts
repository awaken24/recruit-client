import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VagaService } from '../services/vaga.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { FooterComponent } from '../footer/footer.component';
import { NotificationService } from '../shared/notification.service';

@Component({
    selector: 'app-detalhes-vaga',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, FooterComponent],
    templateUrl: './detalhes-vaga.component.html',
    styleUrls: ['./detalhes-vaga.component.css']
})
export class DetalhesVagaComponent implements OnInit {
    vagaId: string | null = null;
    isLoading: boolean = true;
    vaga: any = {};
    isEmpresa: boolean = false;
    public podeSeCandidatar: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private vagaService: VagaService,
        private authService: AuthService,
        private router: Router,
        private notifier: NotificationService
    ) { }

    ngOnInit(): void {
        this.vagaId = this.route.snapshot.paramMap.get('id');

        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const usuario = JSON.parse(userJson);
                this.podeSeCandidatar = usuario.usuarioable_type !== 'App\\Models\\Empresa';
            } catch (exception) {
                this.podeSeCandidatar = false;
            }
        } else {
            this.podeSeCandidatar = false;
        }

        console.log(this.podeSeCandidatar);

        if (this.authService.getUserType() === "empresa") {
            this.isEmpresa = true;
        }

        if (this.vagaId) {
            this.vagaService.getVagaById(this.vagaId).subscribe({
                next: (data) => {
                    this.vaga = data.data;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Erro ao buscar a vaga:', err);
                    this.isLoading = false;
                }
            });
        }
    }

    candidatarSe(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/users/login']);
        } else {
            const candidatoId = this.authService.getUser()?.id;

            if (this.vagaId && candidatoId) {
                this.vagaService.candidatar(Number(this.vagaId), candidatoId).subscribe({
                    next: (response) => {
                        this.notifier.success(response.message);
                        setTimeout(() => {
                            this.router.navigate(['/candidate/dashboard']);
                        }, 3000);
                    },
                    error: (err) => {
                        this.notifier.warning(err.error.message);
                        console.error('Erro ao enviar candidatura:', err);
                    }
                });
            }
        }
    }

    formatTipoEmpresa(tipo: string): string {
        switch (tipo) {
            case 'pequena_media':
                return 'Pequena/média empresa';
            case 'startup':
                return 'Startup';
            case 'grande':
                return 'Grande empresa';
            default:
                return tipo;
        }
    }

    formatarSalario(salario: string): string {
        if (!salario) return '';

        const [min, max] = salario.split('-');

        const formatarValor = (valor: string) => {
            const numero = parseFloat(valor.trim());
            return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        return `${formatarValor(min)} - ${formatarValor(max)}`;
    }

    calcularDiasDesdePublicacao(created_at: string): string {
        if (!created_at) return 'Data de publicação não especificada';

        const dataAtual = new Date();
        const dataRegistro = new Date(created_at);

        if (isNaN(dataRegistro.getTime())) {
            return 'Data de publicação inválida';
        }

        const diferencaEmMs = dataAtual.getTime() - dataRegistro.getTime();

        const diferencaEmDias = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));

        if (diferencaEmDias === 0) {
            return 'Publicada hoje';
        } else if (diferencaEmDias === 1) {
            return 'Publicada há 1 dia';
        } else {
            return `Publicada há ${diferencaEmDias} dias`;
        }
    }
}
