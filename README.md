# Dashboard-Funcional-chartjs

[![Angular](https://img.shields.io/badge/Angular-17-red)](https://angular.io/)
[![Back4App](https://img.shields.io/badge/Back4App-REST-blue)](https://www.back4app.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-5-yellowgreen)](https://www.chartjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Dashboard interativo de filmes desenvolvido em Angular, com gráficos usando Chart.js, interface com Bootstrap e backend no Back4App e na API TMDB. Permite listar filmes ou séries via GET e exibe visualizações dinâmicas por gênero, ano e avaliação.

---

## Estrutura do Projeto

```
Dashboard-Funcional-chartjs/
│
├── src/
│ ├── app/
│ │ ├── components/ # Componentes reutilizáveis
│ │ ├── pages/ # Páginas do aplicativo
│ │ └── services/ # Serviços para integração com Back4App
├── environments/
│ ├── environment.ts
│ └── environment.prod.ts
├── package.json
└── README.md
```

---

## Tecnologias

* Angular 17+
* Chart.js 5+
* Bootstrap 5
* Back4App (Parse Server)
* HTML, CSS, TypeScript

---

## Funcionalidades

* Dashboard com **gráficos interativos**.
* Leitura (Read) de filmes e séries:
  
  * Listagem de filmes (GET) via Back4App.
  * Listagem de tendências da API TMDB
  * Visualização de filmes por gênero (Bar Chart).
  * Layout responsivo com Bootstrap.

---

## Configuração do Ambiente como as chaves da API

1. **Clone o projeto**

```bash
git clone https://github.com/SIN-disciplina-PI2/Dashboard-Funcional-chartjs.git
cd Dashboard-Funcional-chartjs
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as credenciais na raiz do projeto com .env e adicone as chaves**
   
```
BACK4APP_APP_ID=SUA_APP_ID
BACK4APP_API_KEY=SUA_API_KEY
TMDB_API_KEY=SUA_API_KEY
```

4. **Configure o environment.ts para usar as variáveis do .env**

```
export const environment = {
  production: false,
  BACK4APP_APP_ID: process.env.BACK4APP_APP_ID || '',
  BACK4APP_API_KEY: process.env.BACK4APP_API_KEY || '',
  TMDB_API_KEY: process.env.TMDB_API_KEY || ''
};
* Para produção, configure environment.prod.ts de forma semelhante.
```

## Rodando o Projeto

* **Desenvolvimento**

```bash
ng serve
```

Acesse: [http://localhost:4200](http://localhost:4200)

* **Build de produção**

```bash
ng build --configuration production
```

---

## Read na API

### Listar 

O método abaixo processa o dataset de filmes retornado pela API, contando quantos filmes e séries existem e calculando o ano mais produtivo:

```ts
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
```

## Gráficos

* Gerados pelo Chart.js

* O gráfico abaixo exibe a quantidade de filmes e séries por tipo, gerado pelo Chart.js:
```
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
```
---
