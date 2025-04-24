import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CandidatoService {

    constructor(private http: HttpClient) { }

    private baseUrl = 'http://127.0.0.1:8000/api';

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
}
