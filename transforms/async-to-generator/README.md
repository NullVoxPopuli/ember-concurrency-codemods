# async-to-generator


## Usage

```
npx ember-concurrency-codemods async-to-generator path/of/files/ or/some**/*glob.js

# or

yarn global add ember-concurrency-codemods
ember-concurrency-codemods async-to-generator path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js async-to-generator path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [javascript](#javascript)
* [typescript](#typescript)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="javascript">**javascript**</a>

**Input** (<small>[javascript.input.js](transforms/async-to-generator/__testfixtures__/javascript.input.js)</small>):
```js
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

```

**Output** (<small>[javascript.output.js](transforms/async-to-generator/__testfixtures__/javascript.output.js)</small>):
```js
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

```
---
<a id="typescript">**typescript**</a>

**Input** (<small>[typescript.input.ts](transforms/async-to-generator/__testfixtures__/typescript.input.ts)</small>):
```ts
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

```

**Output** (<small>[typescript.output.ts](transforms/async-to-generator/__testfixtures__/typescript.output.ts)</small>):
```ts
import { task } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

class A {
  @task myTask = taskFor(function*(this: A, args) {
    yield Promise.resolve(this.myTask);
  });

  @task
  *myTask2(args) {
    yield Promise.resolve(this.myTask);
  }

  @restartableTask myTask3 = taskFor(function*(this: A, args) {
    yield Promise.resolve(this.myTask);
  });

  @restartableTask
  *myTask4(args) {
    yield Promise.resolve(this.myTask);
  }
}

```
<!--FIXTURES_CONTENT_END-->