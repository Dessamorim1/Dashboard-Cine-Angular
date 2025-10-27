import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';

import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { Tmdb } from '../../services/tmdb';

@Component({
  selector: 'app-tendencias-page',
  imports: [],
  templateUrl: './tendencias-page.html',
  styleUrl: './tendencias-page.css',
})
export class TendenciasPage implements AfterViewInit {
  @ViewChild('genreChart') genreChartCanvas!: ElementRef<HTMLCanvasElement>;

  popularMovies: any[] = [];
  genres: any[] = [];

  topGenreInfo: { name: string, percentage: number } = { name: '', percentage: 0 };
  mostPopularMovie: { title: string, percentage: number } = { title: '', percentage: 0 };
  bestRatedMovie: { title: string; percentage: number } = { title: '', percentage: 0 };

  constructor(private tmdb: Tmdb) { }

  ngAfterViewInit(): void {
    Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

    this.tmdb.getGenres().subscribe(res => {
      this.genres = res.genres;

      this.tmdb.getPopularMovies().subscribe(res => {
        this.popularMovies = res.results;

        this.topGenreInfo = this.getTopGenreInfo();
        if (this.popularMovies.length) {
          this.mostPopularMovie = this.getMostPopularMovie();
          this.bestRatedMovie = this.getBestRatedMovie();
        }

        this.createTopGenresChart();
      });
    });
  }

  private genreTranslations: { [key: string]: string } = {
    "Action": "Ação",
    "Adventure": "Aventura",
    "Animation": "Animação",
    "Comedy": "Comédia",
    "Crime": "Crime",
    "Documentary": "Documentário",
    "Drama": "Drama",
    "Family": "Família",
    "Fantasy": "Fantasia",
    "History": "História",
    "Horror": "Terror",
    "Music": "Música",
    "Mystery": "Mistério",
    "Romance": "Romance",
    "Science Fiction": "Ficção Científica",
    "TV Movie": "Filme de TV",
    "Thriller": "Suspense",
    "War": "Guerra",
    "Western": "Faroeste"
  };

  private getTopGenreInfo(): { name: string, percentage: number } {
    const genreCounts: { [id: number]: number } = {};

    this.popularMovies.forEach(movie => {
      movie.genre_ids.forEach((id: number) => {
        genreCounts[id] = (genreCounts[id] || 0) + 1;
      });
    });

    const topId = Object.keys(genreCounts)
      .map(id => +id)
      .reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);

    const topGenre = this.genres.find(g => g.id === topId);
    const name = topGenre ? (this.genreTranslations[topGenre.name] || topGenre.name) : 'Desconhecido';

    const total = this.popularMovies.length;
    const count = topId ? genreCounts[topId] : 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return { name, percentage };
  }

  private getMostPopularMovie(): { title: string, percentage: number } {
    const totalPopularity = this.popularMovies.reduce((sum, m) => sum + m.popularity, 0);
    const topMovie = this.popularMovies.reduce((prev, current) =>
      prev.popularity > current.popularity ? prev : current
    );

    const percentage = totalPopularity > 0 ? Math.round((topMovie.popularity / totalPopularity) * 100) : 0;

    return {
      title: topMovie.title,
      percentage
    };
  }

  private getBestRatedMovie(): { title: string, percentage: number } {
    if (!this.popularMovies.length) return { title: 'Desconhecido', percentage: 0 };

    const topMovie = this.popularMovies.reduce((prev, current) =>
      prev.vote_average > current.vote_average ? prev : current
    );

    const percentage = Math.round(topMovie.vote_average * 10);
    return {
      title: topMovie.title,
      percentage
    };
  }

  private createTopGenresChart(): void {
    const genreCounts: { [id: number]: number } = {};

    this.popularMovies.forEach(movie => {
      movie.genre_ids.forEach((id: number) => {
        genreCounts[id] = (genreCounts[id] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const labels = sortedGenres.map(([id]) => {
      const genre = this.genres.find(g => g.id === +id);
      return genre ? this.genreTranslations[genre.name] || genre.name : 'Desconhecido';
    });

    const data = sortedGenres.map(([, count]) => count);

    new Chart(this.genreChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Quantidade de Filmes',
          data,
          backgroundColor: '#af1919ff'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Quantidade' } },
          y: { ticks: { autoSkip: false, padding: 5 } }
        },
        layout: { padding: 20 }
      }
    });
  }
}
