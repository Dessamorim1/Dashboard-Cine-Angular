import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, BarController, LineController, LineElement, PointElement, PieController, Title, Tooltip, Legend } from 'chart.js';

import { Back4app } from '../../services/back4app';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  dataset: any[] = [];
  totalTitles = 0;
  totalMovies = 0;
  totalSeries = 0;

  mostProductiveYear: number = 0 ;
  mostProductiveYearCount: number = 0;

  constructor(private back4app: Back4app) { }

  ngAfterViewInit(): void {
    Chart.register(
      CategoryScale, LinearScale,
      BarElement, LineElement, PointElement, ArcElement,
      BarController, LineController, PieController,
      Title, Tooltip, Legend
    );
    this.loadData();
  }

  private loadData() {
    this.back4app.getAll().subscribe(res => {
      this.dataset = res.results;

      this.back4app.getTotalTitles().subscribe(res => this.totalTitles = res.count);
      this.back4app.getTotalMovies().subscribe(res => this.totalMovies = res.count);
      this.back4app.getTotalSeries().subscribe(res => this.totalSeries = res.count);

      const productive = this.calculateMostProductiveYear();
      this.mostProductiveYear = productive.year;
      this.mostProductiveYearCount = productive.total;

      this.createBarChart();
    });
  }

  private createBarChart() {
    const data = this.getTypeData(this.dataset);
    new Chart(this.pieCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Quantidade de títulos por tipo',
          data: Object.values(data),
          backgroundColor: ['#7dcdffff', '#f8c7ffff']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Tipos de Títulos (Filmes x Séries)' },
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Quantidade' } },
          x: { title: { display: true, text: 'Tipo de Título' } }
        }
      }
    });
  }

  private getTypeData(dataset: any[]) {
    const types = { 'Movies': 0, 'TV Shows': 0 };
    dataset.forEach(record => {
      if (record.type === 'Movie') types['Movies']++;
      else if (record.type === 'TV Show') types['TV Shows']++;
    });
    return types;
  }

  private calculateMostProductiveYear() {
    const countsByYear: { [year: number]: number } = {};

    this.dataset.forEach((item: any) => {
      const year = item.release_year;
      if (year) countsByYear[year] = (countsByYear[year] || 0) + 1;
    });

    const mostProductiveYear = Object.keys(countsByYear)
      .map(y => +y)
      .reduce((a, b) => (countsByYear[a] > countsByYear[b] ? a : b), 0);

    const totalTitles = countsByYear[mostProductiveYear] || 0;

    return { year: mostProductiveYear, total: totalTitles };
  }
}
