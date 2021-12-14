import { Component } from '@angular/core';
import { KalmanFilter } from 'kalman-filter';

const TX_POWER = -65;
const INITIAL_RSSI = -90;
const INITIAL_SPEED = 0.57;
const POSITION_VARIANCE = 0.02;
const SPEED_VARIANCE = 0.02;
const TIME_STEP = 0.7;

const rssisTake1 = [
  -89, -86, -92, -80, -86, -85, -81, -83, -84, -77, -78, -81, -72, -74, -86, -72, -70, -78, -94, -65, -70, -62, -67, -76, -71, -78, -82, -77, -72, -69, -73, -78, -62, -60, -75, -62, -75, -60, -57, -55, -74, -52, -64, -60, -57, -56, -85, -75, -63, -43, -42, -43, -56,
];

const rssisTake2 = [
  -86, -78, -65, -93, -79, -86, -84, -83, -84, -89, -88, -75, -82, -72, -75, -75, -78, -92, -79, -78, -62, -70, -87, -71, -77, -57, -69, -63, -84, -70, -63, -57, -81, -58, -63, -60, -58, -61, -57, -71, -53, -60, -59, -57, -61, -56, -62, -60, -71, -67, -84, -71, -72, -52, -56, -47,
];

const rssisTake3 = [
  -93, -80, -96, -83, -82, -91, -75, -75, -87, -71, -65, -90, -70, -95, -72, -80, -71, -83, -81, -78, -73, -62, -68, -72, -74, -69, -79, -88, -67, -72, -74, -67, -59, -60, -67, -60, -67, -58, -63, -67, -59, -74, -72, -58, -61, -60, -54, -59, -55, -55, -70, -73, -64, -58, -55, -78, -70, -70, -58, -61, -65, -52, -48, -58, -51, -56, -55, -39, -55, -55, -40,
];

@Component({
  selector: 'app-root',
  template: `
  <plotly-plot [data]="graphTake1.data" [layout]="graphTake1.layout"></plotly-plot>
  <plotly-plot [data]="graphTake2.data" [layout]="graphTake2.layout"></plotly-plot>
  <plotly-plot [data]="graphTake3.data" [layout]="graphTake3.layout"></plotly-plot>
  `,
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  graphTake1 = getGraph(rssisTake1, 'Kalman filter on RSSI, Take 1');
  graphTake2 = getGraph(rssisTake2, 'Kalman filter on RSSI, Take 2');
  graphTake3 = getGraph(rssisTake3, 'Kalman filter on RSSI, Take 3');
}


function getGraph(rssis: ReadonlyArray<number>, graphTitle: string) {
  const filter = new KalmanFilter({
    observation: 1,
    init: {
      mean: [[INITIAL_RSSI], [INITIAL_SPEED]],
    },
    dynamic: {
      name: 'constant-speed',
      timeStep: TIME_STEP,
      covariance: [POSITION_VARIANCE, SPEED_VARIANCE],
    }
  });
  const filtered = filter.filterAll(rssis).map((x: any) => x[0]);

  return {
    data: [
      { y: rssis, mode: 'markers' },
      { y: filtered },
      // { y: estimates },
    ],
    layout: { width: 1000, height: 500, title: graphTitle }
  }
}

// function getDistance(rssi: number): number {
//   const diff = TX_POWER - rssi;
//   return diff <= 0 ?
//     1 : Math.sqrt(diff) + 1;
// }

// const estimates = filtered.map(getDistance);