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
* [ec-async](#ec-async)
* [old](#old)
* [standard](#standard)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/detach-reactivity/__testfixtures__/basic.input.js)</small>):
```js
import { restartableTask } from 'ember-concurrency';

export class A {
  // ember-concurrency-async + ember-concurrency-ts
  @restartableTask
  boop2 = taskFor(async () => {
    console.log();
  });


}

```

**Output** (<small>[basic.output.js](transforms/detach-reactivity/__testfixtures__/basic.output.js)</small>):
```js
import { restartableTask } from 'ember-concurrency';

export class A {
  // ember-concurrency-async + ember-concurrency-ts
  @restartableTask
  boop2 = taskFor(async () => {
    await Promise.resolve();
    console.log();
  });


}

```
---
<a id="ec-async">**ec-async**</a>

**Input** (<small>[ec-async.input.js](transforms/detach-reactivity/__testfixtures__/ec-async.input.js)</small>):
```js
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

```

**Output** (<small>[ec-async.output.js](transforms/detach-reactivity/__testfixtures__/ec-async.output.js)</small>):
```js
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

```
---
<a id="old">**old**</a>

**Input** (<small>[old.input.js](transforms/detach-reactivity/__testfixtures__/old.input.js)</small>):
```js
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

```

**Output** (<small>[old.output.js](transforms/detach-reactivity/__testfixtures__/old.output.js)</small>):
```js
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

```
---
<a id="standard">**standard**</a>

**Input** (<small>[standard.input.js](transforms/detach-reactivity/__testfixtures__/standard.input.js)</small>):
```js
import { task, task as fooTask } from 'ember-concurrency';

export class A {
  @task
  *foo() {
    console.log();
  }

  @fooTask({ option: 'boop' })
  *foo() {
    console.log();
  }
}

```

**Output** (<small>[standard.output.js](transforms/detach-reactivity/__testfixtures__/standard.output.js)</small>):
```js
import { task, task as fooTask } from 'ember-concurrency';

export class A {
  @task
  *foo() {
    yield Promise.resolve();
    console.log();
  }

  @fooTask({ option: 'boop' })
  *foo() {
    yield Promise.resolve();
    console.log();
  }
}

```
<!--FIXTURES_CONTENT_END-->