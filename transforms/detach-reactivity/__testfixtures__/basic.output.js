import { task, restartableTask, task as fooTask } from 'ember-concurrency';

class A {

  // standard ember-concurrency
  @task
  *foo() {
    yield Promise.resolve();
    console.log();
  }

  @task({ option: 'boop' })
  *foo() {
    yield Promise.resolve();
    console.log();
  }

  // older ember-concurrency
  @fooTask
  foo = function*() {
    yield Promise.resolve();
    console.log();
  };

  @task(function*() {
    yield Promise.resolve();
    console.log();
  })
  theWierdOne;

  @task(function* () {
    yield Promise.resolve();
    console.log();
  }).drop()
  theWierderOne;

  // ember-concurrency-async
  @task async myTask() {
    await Promise.resolve();
    console.log();
  }

  @restartableTask
  boop = async () => {
    await Promise.resolve();
    console.log();
  }

  // ember-concurrency-async + ember-concurrency-ts
  @restartableTask
  boop2 = taskFor(async () => {
    await Promise.resolve();
    console.log();
  });


}
