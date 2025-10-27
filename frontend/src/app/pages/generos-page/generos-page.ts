import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { Chart, CategoryScale, LinearScale, BarElement, BarController, PieController, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Back4app } from '../../services/back4app';
@Component({
  selector: 'app-generos-page',
  imports: [],
  templateUrl: './generos-page.html',
  styleUrl: './generos-page.css',
})
export class GenerosPage implements AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  dataset: any[] = [];

  constructor(private back4app: Back4app) { }

  ngAfterViewInit(): void {
    Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, BarController, PieController, Title, Tooltip, Legend);
    this.loadData();
  }

  private loadData(): void {
    this.back4app.getAll().subscribe(res => {
      this.dataset = res.results;
      this.createGenresPieChart();
      this.createTopGenresBarChart();  
    });
  }

  private countGenres(): { [genre: string]: number } {
    const genreCounts: { [genre: string]: number } = {};
    this.dataset.forEach((item: any) => {
      if (item.listed_in) {
        const genres: string[] = item.listed_in.split(/[,;]+/).map((g: string) => g.trim());
        genres.forEach((g: string) => {
          if (g) genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });
    return genreCounts;
  }

  private getPieColors(n: number): string[] {
    const baseColors = [
      '#FF4C4C', '#36A2EB', '#FFD93D', '#4BC0C0', '#A259FF',
      '#FF8C42', '#C9CBCF', '#8E44AD', '#2ECC71', '#E74C3C'
    ];
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }

  private createGenresPieChart(): void {
    const genreCounts = this.countGenres();
    const labels: string[] = Object.keys(genreCounts);
    const counts: number[] = Object.values(genreCounts);

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: this.getPieColors(labels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: 'white' }
          },
          tooltip: {
            bodyColor: 'white',
            titleColor: '#E74C3C'
          }
        }
      }
    });
  }

  private createTopGenresBarChart(): void {
    const genreCounts = this.countGenres();
    const sortedGenres: [string, number][] = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const labels: string[] = sortedGenres.map(([genre, _]) => genre);
    const counts: number[] = sortedGenres.map(([_, count]) => count);

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Quantidade de títulos',
          data: counts,
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} títulos`
            }
          }
        },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: 'Quantidade de títulos' } },
          y: { ticks: { autoSkip: false, padding: 5, color: 'white' } }
        },
        layout: { padding: 20 }
      }
    });
  }
}
