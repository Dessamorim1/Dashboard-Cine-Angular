import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavBar } from "./_components/nav-bar/nav-bar";
import { CommonModule } from '@angular/common';
import { Dashboard } from "./pages/dashboard/dashboard";
import { HomeComponent } from "./pages/home-component/home-component";
import { FilmesPage } from "./pages/filmes-page/filmes-page";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, CommonModule, Dashboard, HomeComponent, FilmesPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-app');

  showNavbar = signal(true);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavbar.set(event.url !== '/')
      })
  }
}
