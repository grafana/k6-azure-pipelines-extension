import http from 'k6/http';
import { Rate } from 'k6/metrics';

import { sleep } from 'k6';

const myFailRate = new Rate('failed requests');

export const options = {
  iterations: 1,
  thresholds: {
    'failed requests': ['rate<0.1'], // threshold on a custom metric
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/1/');
  myFailRate.add(res.status !== 200);
  sleep(1);
}
