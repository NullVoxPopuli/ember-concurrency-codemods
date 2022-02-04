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
* [other-yield](#other-yield)
* [standard](#standard)
* [variable-declaration](#variable-declaration)
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
<a id="other-yield">**other-yield**</a>

**Input** (<small>[other-yield.input.js](transforms/detach-reactivity/__testfixtures__/other-yield.input.js)</small>):
```js
import { task, timeout } from 'ember-concurrency';

export class A {
  @task
  *expandTask({ delay } = {}) {
    yield timeout(delay ?? 0);
    console.log('hi');
  }
}

```

**Output** (<small>[other-yield.output.js](transforms/detach-reactivity/__testfixtures__/other-yield.output.js)</small>):
```js
import { task, timeout } from 'ember-concurrency';

export class A {
  @task
  *expandTask({ delay } = {}) {
    yield timeout(delay ?? 0);
    console.log('hi');
  }
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
---
<a id="variable-declaration">**variable-declaration**</a>

**Input** (<small>[variable-declaration.input.js](transforms/detach-reactivity/__testfixtures__/variable-declaration.input.js)</small>):
```js
import { task } from 'ember-concurrency';

export class A {
    @task
    *foo() {
        let a = this;
    }
}
```

**Output** (<small>[variable-declaration.output.js](transforms/detach-reactivity/__testfixtures__/variable-declaration.output.js)</small>):
```js
import { task } from 'ember-concurrency';

export class A {
    @task
    *foo() {
        yield Promise.resolve();
        let a = this;
    }
}
```
<!--FIXTURES_CONTENT_END-->