import { task } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

class A {
  @task myTask = taskFor(async (args) => {
    await Promise.resolve(this.myTask);
  });

  @task myTask2 = async (args) => {
    await Promise.resolve(this.myTask);
  };

  @restartableTask myTask3 = taskFor(async (args) => {
    await Promise.resolve(this.myTask);
  });

  @restartableTask myTask4 = async (args) => {
    await Promise.resolve(this.myTask);
  };
}
