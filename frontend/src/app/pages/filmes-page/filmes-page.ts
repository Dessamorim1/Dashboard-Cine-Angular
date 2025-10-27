import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, BarElement, BarController, PieController, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Back4app } from '../../services/back4app';

@Component({
  selector: 'app-filmes-page',
  imports: [],
  templateUrl: './filmes-page.html',
  styleUrl: './filmes-page.css',
})
export class FilmesPage implements AfterViewInit {
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  dataset: any[] = [];
  popularMovies: any[] = [];

  constructor(private back4app: Back4app) { }

  ngAfterViewInit(): void {
    Chart.register(
      CategoryScale, LinearScale, LineElement, PointElement, LineController,
      BarElement, BarController, PieController, ArcElement, Title, Tooltip, Legend
    );

    this.loadData();
  }

  private loadData(): void {
    this.back4app.getAll().subscribe(res => {
      this.dataset = res.results.filter((m: any) => m.type === 'Movie');

      this.popularMovies = this.dataset;

      this.createLineChart();
      this.createTopCountriesChart();

      console.log('Média de avaliação:', this.getAverageRating());
    });
  }

  getAverageRating(): number {
    if (!this.popularMovies.length) return 0;
    const total = this.popularMovies.reduce((sum, m) => sum + (m.vote_average || 0), 0);
    return +(total / this.popularMovies.length).toFixed(1);
  }

  private createLineChart(): void {
    const countsByYear: { [year: number]: number } = {};
    this.dataset.forEach((movie: { release_year?: number }) => {
      if (movie.release_year) {
        countsByYear[movie.release_year] = (countsByYear[movie.release_year] || 0) + 1;
      }
    });

    const years = Object.keys(countsByYear).map(y => +y).sort((a, b) => a - b);
    const counts = years.map(y => countsByYear[y]);

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Filmes lançados por ano',
          data: counts,
          borderColor: '#4df664ff',
          backgroundColor: '#ff6b6b33',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Quantidade' } },
          x: { title: { display: true, text: 'Ano' } }
        }
      }
    });
  }

  private createTopCountriesChart(): void {
    const countsByCountry: { [country: string]: number } = {};

    this.dataset.forEach((movie: { country?: string }) => {
      if (movie.country) {
        const countries: string[] = movie.country.split(/[,;]+/).map((c: string) => c.trim());
        countries.forEach((c: string) => {
          if (c) countsByCountry[c] = (countsByCountry[c] || 0) + 1;
        });
      }
    });

    const sortedCountries = Object.entries(countsByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const countryLabels = sortedCountries.map(([country]) => country);
    const countryCounts = sortedCountries.map(([, count]) => count);

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: countryLabels,
        datasets: [{
          label: 'Quantidade de filmes',
          data: countryCounts,
          backgroundColor: '#4dc9f6'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `${context.label}: ${context.raw} filmes`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Quantidade' } },
          y: {
            ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, align: 'start', padding: 5 }
          }
        },
        layout: { padding: 20 }
      }
    });
  }
}
