import { Component } from '@angular/core';
import { HeaderComponent} from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {

}
