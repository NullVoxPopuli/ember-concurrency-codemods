import { task, task as fooTask } from 'ember-concurrency';

export class A {
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
}
