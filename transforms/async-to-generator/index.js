const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

const { hasDecorators, firstMatchingDecorator } = require('../-utils');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  // Remember to use the `ts` parser
  let root = j(file.source);
  let emberConcurrency = 'ember-concurrency';
  let emberConcurrencyDecorators = 'ember-concurrency-decorators';
  let emberConcurrencyTs = 'ember-concurrency-ts';

  let decoratorNames = new Set();
  let taskForName;

  // Find task decorators
  for (let modulePath of [emberConcurrency, emberConcurrencyDecorators]) {
    root.find(j.ImportDeclaration, { source: { value: modulePath } }).forEach((path) => {
      let names = path.node.specifiers.map((specifier) => specifier.local.name);

      names.forEach((name) => decoratorNames.add(name));
    });
  }

  // find taskFor
  root.find(j.ImportSpecifier, { imported: { name: 'taskFor' } }).forEach((path) => {
    taskForName = path.node.local.name;
  });

  function forceBodyToYield(body) {
    j(body)
      .find(j.AwaitExpression)
      .forEach((path) => {
        let toYield = j.yieldExpression(path.node.argument);

        j(path).replaceWith([toYield]);
      });
  }

  root.find(j.ClassDeclaration).forEach((path) => {
    let className = path.node.id.name;

    function thisParam() {
      // the TS-specific builder functions are super unergonomic,
      // and there is nodocumentation / 0-discoverability on how to use them
      let param = j.identifier(`this: ${className}`);

      return param;
    }

    function hasThisParam(params) {
      return params.some((param) => param.name === 'this' && param.typeAnnotation);
    }

    function arrowFunctionToAnonymousGenerator(fn) {
      let newBody = fn.body.body;

      forceBodyToYield(newBody);

      let params = [...fn.params];

      if (!hasThisParam(params)) {
        params.unshift(thisParam());
      }

      let newFunction = j.functionExpression(null, params, j.blockStatement([...newBody]), true);

      return newFunction;
    }

    function propertyToGeneratorMethod(path) {
      let { node } = path;
      let { decorators, value } = node;

      let newBody = value.body.body;

      forceBodyToYield(newBody);

      let params = [...value.params];
      let functionExpression = j.functionExpression(null, params, j.blockStatement(newBody), true);
      let generatorMethod = j.methodDefinition('method', node.key, functionExpression);

      generatorMethod.decorators = decorators;

      j(path).replaceWith(generatorMethod);
    }

    j(path.node)
      .find(j.ClassProperty)
      .forEach((path) => {
        let { node } = path;
        let { decorators, value } = node;

        let hasECDecorator = hasDecorators(node, [...decoratorNames.values()]);

        if (!hasECDecorator) return;

        switch (value.type) {
          case 'ArrowFunctionExpression': {
            propertyToGeneratorMethod(path);

            return;
          }
          case 'CallExpression': {
            if (value.callee.name === taskForName) {
              if (value.arguments.length !== 1) return;

              let fn = value.arguments[0];

              if (fn.type !== 'ArrowFunctionExpression') return;

              let newFunction = arrowFunctionToAnonymousGenerator(fn);

              value.arguments[0] = newFunction;

              return;
            }
          }
        }
      });
  });

  return root.toSource();
};

module.exports.type = 'js';
