import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class VagaService {

    private baseUrl = `${API_BASE_URL}/api`;
    constructor(private http: HttpClient) { }

    registrarVaga(dadosVaga: any): Observable<any> {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.baseUrl}/vagas/register`, dadosVaga, { headers });
    }

    getVagas(habilidadeId?: number): Observable<any> {
        let url = `${this.baseUrl}/vagas`;

        if (habilidadeId) {
            url += `?habilidade=${habilidadeId}`;
        }

        return this.http.get(url, {
            headers: this.getHeaders()
        });
    }


    getEmpresaVagas(): Observable<any> {
        return this.http.get(`${this.baseUrl}/vagas/empresa`, {
            headers: this.getHeaders()
        });
    }

    getVagaById(vagaId: any): Observable<any> {
        let url = `${this.baseUrl}/vagas/${vagaId}`;
        return this.http.get(url, {
            headers: this.getHeaders()
        });
    }

    private getHeaders() {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    candidatar(vagaId: number, candidatoId: number): Observable<any> {
        const headers = this.getHeaders();

        return this.http.post(
            `${this.baseUrl}/vagas/candidatura`,
            { vaga_id: vagaId, candidato_id: candidatoId },
            { headers }
        );
    }

    gerenciarVaga(vagaId: any): Observable<any> {
        let url = `${this.baseUrl}/vagas/gerenciar/${vagaId}`;
        return this.http.post(url, {
            headers: this.getHeaders()
        });
    }

    aprovarCandidatura(candidaturaId: number): Observable<any> {
        const headers = this.getHeaders();
        return this.http.patch(`${this.baseUrl}/candidaturas/${candidaturaId}/aprovar`, {}, { headers });
    }

    reprovarCandidatura(candidaturaId: number): Observable<any> {
        const headers = this.getHeaders();
        return this.http.patch(`${this.baseUrl}/candidaturas/${candidaturaId}/reprovar`, {}, { headers });
    }

    getPainelVagas(): Observable<any> {
        const headers = this.getHeaders();
        return this.http.post<{ recomendadas: any[], candidatadas: any[] }>(
            `${this.baseUrl}/candidato/painel`,
            {},
            { headers }
        );
    }


}
