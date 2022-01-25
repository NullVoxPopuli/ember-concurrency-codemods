import { task, restartableTask } from 'ember-concurrency';

export class A {
  @task async myTask() {
    await Promise.resolve();
    console.log();
  }

  @restartableTask
  boop = async () => {
    await Promise.resolve();
    console.log();
  }
}
