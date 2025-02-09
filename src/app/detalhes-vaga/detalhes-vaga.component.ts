import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { VagaService } from '../services/vaga.service';

@Component({
    selector: 'app-detalhes-vaga',
    imports: [FontAwesomeModule, FooterComponent, LoadingSpinnerComponent, CommonModule],
    templateUrl: './detalhes-vaga.component.html',
    styleUrl: './detalhes-vaga.component.css',
    standalone: true
})
export class DetalhesVagaComponent {
    vagaId: string | null = null;
    vaga: any;
    isLoading: boolean = true;

    constructor(private route: ActivatedRoute, private vagaservice: VagaService) { }

    ngOnInit(): void {
        this.vagaId = this.route.snapshot.paramMap.get('id');
        
        if (this.vagaId) {
            this.vagaservice.getVagaById(this.vagaId).subscribe({
                next: (data) => {
                    this.vaga = data;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Erro ao buscar a vaga:', err);
                    this.isLoading = false;
                }
            });
        }

    }

}
