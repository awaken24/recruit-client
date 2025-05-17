import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { API_BASE_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = `${API_BASE_URL}/api/auth`;

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

    checkAuthStatus(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.get(`${this.baseUrl}/check`, { headers });
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

    enviarLinkResetSenha(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/forgot-password`, { email });
    }

    redefinirSenha(data: {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) {
        return this.http.post(`${this.baseUrl}/reset-password`, data);
    }

    validarTokenReset(email: string, token: string) {
        return this.http.get(`${this.baseUrl}/validate-reset-token`, {
            params: { email, token }
        });
    }
}
