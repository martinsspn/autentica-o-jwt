import { Component, HostListener } from '@angular/core';
import { AuthService } from './auth/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'autenticacao-jwt';

  constructor(private authService: AuthService) {}

    @HostListener('window:mousemove')
    @HostListener('window:keydown')
    @HostListener('window:click')
    @HostListener('window:scroll')
    resetTimeout(): void {
        this.authService.startSessionTimeout();
    }
}
