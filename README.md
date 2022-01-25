# ember-concurrency-codemods


A collection of codemods for ember-concurrency-codemods.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-concurrency-codemods <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-concurrency-codemods
ember-concurrency-codemods <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [detach-reactivity](transforms/detach-reactivity/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`