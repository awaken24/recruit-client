import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {

    constructor(private http: HttpClient) { }
    private baseUrl = `${API_BASE_URL}/api`;
  
    enviarDadosEmpresa(dadosEmpresa: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/empresas/register`, dadosEmpresa, { headers });
    }

    getDataEmpresa(id: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const url = `${this.baseUrl}/empresas/profile/${id}`;

        return this.http.get(url, { headers });
    }

    getDashboardData(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/empresa/dashboard`, {}, { headers: headers });
    }

    getCompanyConfig(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/empresa/config`, {}, { headers: headers });
    }

    salvarConfiguracao(config: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/empresa/salvarConfiguracoes`, config, { headers: headers });
    }

    atualizarEmpresa(id: number, dados: FormData): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.baseUrl}/empresa/${id}/atualizar`, dados, { headers });
    }
}
