import { task } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

class A {
  @task myTask = taskFor(function*(args) {
    yield Promise.resolve(this.myTask);
  });

  @task
  *myTask2(args) {
    yield Promise.resolve(this.myTask);
  }

  @restartableTask myTask3 = taskFor(function*(args) {
    yield Promise.resolve(this.myTask);
  });

  @restartableTask
  *myTask4(args) {
    yield Promise.resolve(this.myTask);
  }
}
