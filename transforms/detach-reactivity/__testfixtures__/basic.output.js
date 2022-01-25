import { restartableTask } from 'ember-concurrency';

export class A {
  // ember-concurrency-async + ember-concurrency-ts
  @restartableTask
  boop2 = taskFor(async () => {
    await Promise.resolve();
    console.log();
  });


}
