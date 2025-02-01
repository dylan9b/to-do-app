import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthService, CookieService],
  standalone: true,
})
export class AppComponent {
  title = 'to-do-app';
}
