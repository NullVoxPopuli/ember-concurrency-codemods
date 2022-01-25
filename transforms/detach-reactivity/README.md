# detach-reactivity


## Usage

```
npx ember-concurrency-codemods detach-reactivity path/of/files/ or/some**/*glob.js

# or

yarn global add ember-concurrency-codemods
ember-concurrency-codemods detach-reactivity path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js detach-reactivity path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/detach-reactivity/__testfixtures__/basic.input.js)</small>):
```js
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

```

**Output** (<small>[basic.output.js](transforms/detach-reactivity/__testfixtures__/basic.output.js)</small>):
```js
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

```
<!--FIXTURES_CONTENT_END-->