import { task, restartableTask, task as fooTask } from 'ember-concurrency';

class A {

  // standard ember-concurrency
  @task
  *foo() {
    console.log();
  }

  @task({ option: 'boop' })
  *foo() {
    console.log();
  }

  // older ember-concurrency
  @fooTask
  foo = function*() {
    console.log();
  };

  @task(function*() {
    console.log();
  })
  theWierdOne;

  @task(function* () {
    console.log();
  }).drop()
  theWierderOne;

  // ember-concurrency-async
  @task async myTask() {
    console.log();
  }

  @restartableTask
  boop = async () => {
    console.log();
  }

  // ember-concurrency-async + ember-concurrency-ts
  @restartableTask
  boop2 = taskFor(async () => {
    console.log();
  });


}
