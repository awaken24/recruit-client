import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class CandidatoService {

    constructor(private http: HttpClient) { }

    private baseUrl = `${API_BASE_URL}/api`;

    enviarDadosCandidato(dadosEmpresa: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/candidato/register/`, dadosEmpresa, { headers });
    }

    getDashboardData(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/candidato/dashboard`, {}, { headers: headers });
    }

    getCandidateProfile(id: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(`${this.baseUrl}/candidato/profile/${id} `, { headers });
    }

    getCandidatoConfig(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/candidato/configuracao`, {}, { headers: headers });
    }

    salvarConfiguracao(config: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/candidato/salvarConfiguracoes`, config, { headers: headers });
    }

    buscarCandidato(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.baseUrl}/candidato/perfil`, { headers });
    }  

    atualizarCandidato(id: number, dados: FormData): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  
        return this.http.post(`${this.baseUrl}/candidato/${id}/atualizar`, dados, { headers });
    }

    aproveitarOportunidade(oportunidadeId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  
        return this.http.post(`${this.baseUrl}/vagas/aproveitar-candidatura/${oportunidadeId}`, null, { headers: headers });
    }

    recusarOportunidade(oportunidadeId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  
        return this.http.post(`${this.baseUrl}/vagas/recusar-candidatura/${oportunidadeId}`, null, { headers: headers });
    }
}
