import { Component } from '@angular/core';
import { KalmanFilter } from 'kalman-filter';

const TX_POWER = -65;

@Component({
  selector: 'app-root',
  template: '<plotly-plot [data]="graph.data" [layout]="graph.layout"></plotly-plot>',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  graph = {
    data: [
      { y: rssis, mode: 'markers' },
      { y: filtered },
      // { y: estimates },
    ],
    layout: { width: 1000, height: 500, title: 'Kalman filter on RSSI' }
  }
}

const filter = new KalmanFilter({
  observation: 1,
  init: {
    // Initial guess:
    // RSSI: -75,
    // speed: 10 RSSI/step
    mean: [[-75], [10]],
  },
  dynamic: {
    name: 'constant-speed',
    // Assume we get 3 measurements between moves.
    timeStep: 0.3,
    // Assume small measurement errors.
    covariance: [0.01, 0.01],
  }
});

const rssis = [
  // 6m distance
  -84, -96,

  // 4m distance
  -74, -81, -69, -91, -70, -66, -78, -74, -90, -69, -78,

  // 3m distance
  -56, -75, -73, -76, -81, -58, -75, -56, -73,

  // 1m distance
  -56, -75, -73, -76, -81, -58, -75, -56, -73,
];

const filtered = filter.filterAll(rssis).map((x: any) => x[0]);

function getDistance(rssi: number): number {
  const diff = TX_POWER - rssi;
  return diff <= 0 ?
    1 : Math.sqrt(diff) + 1;
}

const estimates = filtered.map(getDistance);