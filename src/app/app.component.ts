import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SocialLoginModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthService, CookieService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
