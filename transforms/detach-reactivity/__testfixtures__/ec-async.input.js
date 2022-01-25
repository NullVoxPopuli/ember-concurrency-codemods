import { task, restartableTask } from 'ember-concurrency';

export class A {
  @task async myTask() {
    console.log();
  }

  @restartableTask
  boop = async () => {
    console.log();
  }
}
