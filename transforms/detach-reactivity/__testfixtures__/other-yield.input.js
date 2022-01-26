import { task, timeout } from 'ember-concurrency';

export class A {
  @task
  *expandTask({ delay } = {}) {
    yield timeout(delay ?? 0);
    console.log('hi');
  }
}
