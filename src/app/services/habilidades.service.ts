import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class HabilidadesService {

    constructor(private http: HttpClient) { }
    private baseUrl = `${API_BASE_URL}/api`;

    getHabilidades(): Observable<any> {
        return this.http.get(`${this.baseUrl}/habilidades`);
    }
}
