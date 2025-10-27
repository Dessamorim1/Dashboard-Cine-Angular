import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component';
import { Dashboard } from './pages/dashboard/dashboard';
import { FilmesPage } from './pages/filmes-page/filmes-page';
import { SeriesPage } from './pages/series-page/series-page';
import { GenerosPage } from './pages/generos-page/generos-page';
import { TendenciasPage } from './pages/tendencias-page/tendencias-page';

export const routes: Routes = [{ path: '', component: HomeComponent },
{ path: 'dashboard', component: Dashboard },
{ path: 'filmes', component: FilmesPage },
{ path: 'series', component: SeriesPage },
{ path: 'generos', component: GenerosPage },
{ path: 'tendencias', component: TendenciasPage }
];
