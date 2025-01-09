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

    getEmpresaVagas(): Observable<any> {
        return this.http.get(`${this.baseUrl}/vagas/empresa`, {
            headers: this.getHeaders()
        });
    }

    private getHeaders() {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }
}
