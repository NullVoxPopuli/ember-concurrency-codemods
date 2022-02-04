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
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.ts](transforms/async-to-generator/__testfixtures__/basic.input.ts)</small>):
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

**Output** (<small>[basic.output.ts](transforms/async-to-generator/__testfixtures__/basic.output.ts)</small>):
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