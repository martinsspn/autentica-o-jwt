import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'] 
})
export class LoginComponent {
  email : string = '';
  password : string = '';
  errorMessage : string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (res) => {
        localStorage.setItem('token', res.access);
        this.router.navigate(['/dashboard']);  // Redireciona após login
      },
      (err) => this.errorMessage = 'Credenciais inválidas!'
    );
  }
}
