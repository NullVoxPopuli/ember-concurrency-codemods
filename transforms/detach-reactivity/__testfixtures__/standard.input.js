import { task, task as fooTask } from 'ember-concurrency';

export class A {
  @task
  *foo() {
    console.log();
  }

  @fooTask({ option: 'boop' })
  *foo() {
    console.log();
  }
}
