import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {

    constructor(private http: HttpClient) { }
    private baseUrl = 'http://127.0.0.1:8000/api';

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
}
