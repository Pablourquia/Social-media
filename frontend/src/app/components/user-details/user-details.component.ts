import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {
  name: string = '';
  email: string = '';
  photo: string = '';

  constructor(
  
  ) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name') || '';
    this.email = localStorage.getItem('email') || '';
    this.photo = localStorage.getItem('photo') || '';
  }
}
