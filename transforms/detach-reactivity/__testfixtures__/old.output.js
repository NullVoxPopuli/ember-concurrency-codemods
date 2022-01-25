import { task, task as fooTask } from 'ember-concurrency';

export class A {
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
}
