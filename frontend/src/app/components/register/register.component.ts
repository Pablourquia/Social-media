import { Component } from '@angular/core';
import { AutheticateService } from '../../core/autheticate.service';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AutheticateService,
    private router: Router
  ) {}

  register(): void {
    this.authService.registerUser({ name: this.name, email: this.email, password: this.password }).subscribe(
      () => {
        this.router.navigate(['/user-details']);
      },
      error => {
        console.log(error);
        if (error.status === 401) {
          this.errorMessage = 'Por favor, rellene todos los campos';
        }
        else if (error.status === 402) {
          this.errorMessage = 'Este usuario ya existe';
        }
        else {
          this.errorMessage = 'Error desconocido';
        }
      }
    );
  }

}
