import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { AutheticateService } from '../../../core/autheticate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen: boolean = false;

  constructor(
    private authService: AutheticateService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  

}
