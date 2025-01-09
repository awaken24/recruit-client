import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabilidadesService {

    constructor(private http: HttpClient) { }
    private baseUrl = 'http://127.0.0.1:8000/api';

    getHabilidades(): Observable<any> {
        return this.http.get(`${this.baseUrl}/habilidades`);
    }
}
