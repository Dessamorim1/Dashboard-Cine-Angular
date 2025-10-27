import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Tmdb {

  private apiKey = environment.API_KEY_TMB;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=pt-BR&page=${page}`);
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`);
  }

  getMostPopularMovie(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=pt-BR&page=1`);
  }

}
