import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://127.0.0.1:8000/api/auth';

    private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
    isLoggedIn$ = this.loggedIn.asObservable();

    constructor(private http: HttpClient) { }

    login(credentials: { email: string; password: string }, userType: 'candidato' | 'empresa'): Observable<any> {
        const endpoint = userType === 'candidato' ? '/login' : '/login';
        return this.http.post(`${this.baseUrl}${endpoint}`, credentials);
    }

    logout(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        const logoutRequest = this.http.post(`${this.baseUrl}/logout`, {}, { headers }).pipe(
            catchError((error: any) => {
                console.error('Erro ao fazer logout no servidor:', error);
                return of(null);
            }),
            finalize(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.updateLoginState(false);
            })
        );

        return logoutRequest;
    }

    register(data: any, userType: 'candidato' | 'empresa'): Observable<any> {
        const endpoint = userType === 'candidato' ? '/candidato/register/usuario' : '/empresas/register/usuario';
        return this.http.post(`${this.baseUrl}${endpoint}`, data);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    updateLoginState(isLoggedIn: boolean): void {
        this.loggedIn.next(isLoggedIn);
    }

    getUserType(): string | null {
        const user = this.getUser();

        if (!user) {
            return null;
        }

        switch (user.usuarioable_type) {
            case 'App\\Models\\Empresa':
                return 'empresa';
            case 'App\\Models\\Candidato':
                return 'candidato';
            default:
                return null;
        }
    }
}
