import { task, task as fooTask } from 'ember-concurrency';

export class A {
  @task
  *foo() {
    yield Promise.resolve();
    console.log();
  }

  @fooTask({ option: 'boop' })
  *foo() {
    yield Promise.resolve();
    console.log();
  }
}
