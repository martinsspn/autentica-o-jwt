import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const API_URL = 'http://127.0.0.1:8000/api/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private timeout: any;  // Timer para detectar inatividade

    constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
        this.startSessionTimeout();  // Inicia o timer ao carregar o serviço
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${API_URL}token/`, { username, password }).pipe(
            map((res: any) => {
                localStorage.setItem('access_token', res.access);
                localStorage.setItem('refresh_token', res.refresh);
                this.startSessionTimeout();
                return res;
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        clearTimeout(this.timeout);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('access_token');
        return token ? !this.jwtHelper.isTokenExpired(token) : false;
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    refreshToken(): Observable<any> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            this.logout();
            return of(null);
        }

        return this.http.post(`${API_URL}token/refresh/`, { refresh: refreshToken }).pipe(
            map((res: any) => {
                localStorage.setItem('access_token', res.access);
                this.startSessionTimeout();
                return res;
            }),
            catchError(() => {
                this.logout();
                return of(null);
            })
        );
    }

    register(username: string, password: string): Observable<any> {
        return this.http.post(`${API_URL}register/`, { username, password });
    }

    startSessionTimeout(): void {
        clearTimeout(this.timeout);  // Reinicia o contador de inatividade

        // Após 55 minutos de inatividade, tenta renovar o token
        this.timeout = setTimeout(() => {
            this.refreshToken().subscribe();
        }, 55 * 60 * 1000);

        // Após 1 hora de inatividade, desloga o usuário
        setTimeout(() => {
            this.logout();
        }, 60 * 60 * 1000);
    }
}
