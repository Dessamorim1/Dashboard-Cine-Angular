import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Back4app {
  private readonly apiUrl = 'https://parseapi.back4app.com/classes/movies';
  private readonly headers = new HttpHeaders({
    'X-Parse-Application-Id': environment.BACK4APP_APP_ID,
    'X-Parse-REST-API-Key': environment.BACK4APP_API_KEY,
  });
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.headers });
  }

  getTotalTitles(): Observable<any> {
    const url = `${this.apiUrl}?count=1&limit=0`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getTotalMovies(): Observable<any> {
    const query = encodeURIComponent(JSON.stringify({ type: 'Movie' }));
    const url = `${this.apiUrl}?where=${query}&count=1&limit=0`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getTotalSeries(): Observable<any> {
    const query = encodeURIComponent(JSON.stringify({ type: 'TV Show' }));
    const url = `${this.apiUrl}?where=${query}&count=1&limit=0`;
    return this.http.get<any>(url, { headers: this.headers });
  }

}
