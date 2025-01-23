import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'] 
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.username, this.password).subscribe(
      (res) => {
        this.message = 'Usuário criado com sucesso!';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']); // Redireciona para o login
        }, 2000);
      },
      (err) => {
        this.errorMessage = err.error.error || 'Erro ao criar usuário!';
        this.message = '';
      }
    );
  }
}
