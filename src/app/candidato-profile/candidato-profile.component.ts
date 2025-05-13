import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CandidatoService } from '../services/candidato.service';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../app.config';
import { NotificationService } from '../shared/notification.service';

@Component({
	selector: 'app-candidato-profile',
	imports: [CommonModule],
	templateUrl: './candidato-profile.component.html',
	styleUrl: './candidato-profile.component.css'
})
export class CandidatoProfileComponent {
	candidato: any = null;
	isLoading = true;
	fotoPerfil: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private http: HttpClient,
		private candidatoService: CandidatoService,
		private notifier: NotificationService
	) { }

	ngOnInit(): void {
		const id = this.route.snapshot.params['id'];
		this.loadCandidate(id);
	}

	loadCandidate(id: string): void {
		this.isLoading = true;

		this.candidatoService.getCandidateProfile(+id).subscribe({
			next: (response: any) => {
				if (response.status === 'success') {
					this.candidato = response.data;

					this.candidato.habilidades = this.candidato.habilidades || [];

					if (this.candidato.foto_perfil) {
						this.fotoPerfil = `${API_BASE_URL}/${this.candidato.foto_perfil}`;
					}
				}

				this.isLoading = false;
			},
			error: (error) => {
				console.error('Erro ao carregar dados do candidato:', error);
				this.isLoading = false;
			}
		});
	}

	downloadCV() {
		if (this.candidato.curriculo) {
			window.open(`${API_BASE_URL}/${this.candidato.curriculo}` , '_blank');
		} else {
			this.notifier.warning("URL do currículo não disponível");
		}
	}

	private showNotification(message: string): void {
		const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = message;
		document.body.appendChild(notification);

		// Usar classes ao invés de estilo inline
		setTimeout(() => {
			notification.classList.add('show');
		}, 10);

		setTimeout(() => {
			notification.classList.remove('show');

			setTimeout(() => {
				document.body.removeChild(notification);
			}, 300);
		}, 3000);
	}

	getFullName(): string {
		return this.candidato ? `${this.candidato.nome} ${this.candidato.sobrenome}` : '';
	}

	getExperiencePeriod(exp: any): string {
		const inicio = `${exp.mesInicio}/${exp.anoInicio}`;
		const fim = exp.trabalhoAtual ? 'Presente' : `${exp.mesFim}/${exp.anoFim}`;
		return `${inicio} - ${fim}`;
	}
}
