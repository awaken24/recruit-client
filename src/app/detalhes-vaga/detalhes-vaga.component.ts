import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { VagaService } from '../services/vaga.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-detalhes-vaga',
    imports: [FontAwesomeModule, FooterComponent, LoadingSpinnerComponent, CommonModule],
    templateUrl: './detalhes-vaga.component.html',
    styleUrl: './detalhes-vaga.component.css',
    standalone: true
})
export class DetalhesVagaComponent {
    vagaId: string | null = null;
    isLoading: boolean = true;
    vaga: any = {};
    isEmpresa: boolean = false;

    constructor(
        private route: ActivatedRoute, 
        private vagaservice: VagaService, 
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.vagaId = this.route.snapshot.paramMap.get('id');

        console.log("Antes: " + this.isEmpresa);
        if (this.authService.getUserType() === "empresa") {
            this.isEmpresa = true;
        }
        console.log("Depois: " + this.isEmpresa);

        if (this.vagaId) {
            this.vagaservice.getVagaById(this.vagaId).subscribe({
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
                this.vagaservice.candidatar(Number(this.vagaId), candidatoId).subscribe({
                    next: (response) => {
                        console.log('Candidatura enviada com sucesso:', response);
                        alert('Candidatura realizada com sucesso!');
                    },
                    error: (err) => {
                        console.error('Erro ao enviar candidatura:', err);
                        alert('Erro ao enviar candidatura. Tente novamente.');
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

}
