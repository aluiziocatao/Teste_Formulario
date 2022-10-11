import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title: string = 'frontend';
  public isLogged: boolean = false;

  constructor (
    private authService: AuthService,
    private router: Router
  ) { 
    this.tokenIsValid();
  }
  
  public tokenIsValid(): void {
    const token: string | null = this.authService.getToken();

    if (!token) {
      this.isLogged = false;
      return;
    }

    this.authService.validToken(token).subscribe(data => this.isLogged = true, error => this.isLogged = false);
  }

  public onLogoutClick(): void {
    this.authService.logout();
  }
  
  ngOnInit(): void {

  }
}
