import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, BarElement, BarController, PieController, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Back4app } from '../../services/back4app';


@Component({
  selector: 'app-series-page',
  imports: [],
  templateUrl: './series-page.html',
  styleUrl: './series-page.css',
})
export class SeriesPage {
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('seasonsCanvas') seasonsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genresCanvas') genresCanvas!: ElementRef<HTMLCanvasElement>;

  dataset: any[] = [];

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
      this.dataset = res.results.filter((m: any) => m.type === 'TV Show');

      this.createLineChart();
      this.createTopCountriesChart();
      this.createSeasonsDistributionChart();
      this.createTopGenresChart();
    });
  }

  private createLineChart(): void {
    const countsByYear: { [year: number]: number } = {};

    this.dataset.forEach((series: { release_year?: number }) => {
      if (series.release_year) {
        countsByYear[series.release_year] = (countsByYear[series.release_year] || 0) + 1;
      }
    });

    const years = Object.keys(countsByYear).map(y => +y).sort((a, b) => a - b);
    const counts = years.map(y => countsByYear[y]);

    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: years,
        datasets: [{
          label: 'Séries lançadas por ano',
          data: counts,
          borderColor: '#4caf50',
          backgroundColor: '#4caf5033',
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

    this.dataset.forEach((series: { country?: string }) => {
      if (series.country) {
        const countries: string[] = series.country.split(/[,;]+/).map((c: string) => c.trim());
        countries.forEach((c: string) => {
          if (c) countsByCountry[c] = (countsByCountry[c] || 0) + 1;
        });
      }
    });

    const sortedCountries: [string, number][] = Object.entries(countsByCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const countryLabels: string[] = sortedCountries.map(([country, _count]: [string, number]) => country);
    const countryCounts: number[] = sortedCountries.map(([_, count]: [string, number]) => count);

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: countryLabels,
        datasets: [{
          label: 'Quantidade de séries',
          data: countryCounts,
          backgroundColor: '#ff9800'
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
              label: function (context) {
                return `${context.label}: ${context.raw} séries`;
              }
            }
          }
        },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Quantidade' } },
          y: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, align: 'start', padding: 5 } }
        },
        layout: { padding: 20 }
      }
    });
  }

  private createSeasonsDistributionChart(): void {
    const countsBySeasons: { [seasons: string]: number } = {};

    this.dataset.forEach((series: { duration?: string }) => {
      if (series.duration) {
        const match = series.duration.match(/\d+/);
        if (match) {
          const n = match[0];
          countsBySeasons[n] = (countsBySeasons[n] || 0) + 1;
        }
      }
    });

    const sortedSeasons = Object.keys(countsBySeasons).sort((a, b) => +a - +b);
    const counts = sortedSeasons.map(s => countsBySeasons[s]);

    new Chart(this.seasonsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: sortedSeasons.map(s => `${s} Temporada${+s > 1 ? 's' : ''}`),
        datasets: [{
          label: 'Número de séries',
          data: counts,
          backgroundColor: '#ff5722'
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

  private createTopGenresChart(): void {
    const countsByGenre: { [genre: string]: number } = {};

    this.dataset.forEach((series: { listed_in?: string }) => {
      if (series.listed_in) {
        const genres: string[] = series.listed_in.split(',').map(g => g.trim());
        genres.forEach(g => {
          if (g) countsByGenre[g] = (countsByGenre[g] || 0) + 1;
        });
      }
    });

    const sortedGenres: [string, number][] = Object.entries(countsByGenre)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const genreLabels: string[] = sortedGenres.map(([genre]) => genre);
    const genreCounts: number[] = sortedGenres.map(([_, count]) => count);

    new Chart(this.genresCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: genreLabels,
        datasets: [{
          label: 'Quantidade de séries',
          data: genreCounts,
          backgroundColor: '#9c27b0'
        }]
      },
      options: {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,
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
