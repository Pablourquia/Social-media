import { Component } from '@angular/core';
import { AutheticateService } from '../../core/autheticate.service';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AutheticateService,
    private router: Router
  ) {}

  login(): void {
    this.authService.loginUser(this.email, this.password ).subscribe(
      () => {
        this.router.navigate(['/user-details']);
      },
      error => {
        console.log(error);
        if (error.status === 401) {
          this.errorMessage = 'Por favor, rellene todos los campos';
        }
        else if (error.status === 402) {
          this.errorMessage = 'Este usuario no existe';
        }
        else if (error.status === 403) {
          this.errorMessage = 'Contraseña incorrecta';
        }
        else {
          this.errorMessage = 'Error desconocido';
        }
      }
    );
  }

}
