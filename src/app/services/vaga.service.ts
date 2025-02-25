import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VagaService {

    private baseUrl = 'http://127.0.0.1:8000/api';
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

}
