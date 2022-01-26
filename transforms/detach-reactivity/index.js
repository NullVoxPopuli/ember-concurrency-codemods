const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  // Remember to use the `ts` parser
  let root = j(file.source);
  let comment = 'Added as a part of the ember-concurrency v1.3.0 to 2.2.0 codemod';
  let yieldyBoi = j.expressionStatement(j.identifier(`yield Promise.resolve()`));
  let awaited = j.expressionStatement(j.identifier(`await Promise.resolve()`));
  let importPath = 'ember-concurrency';
  let importedSpecifierNames = [];

  yieldyBoi.comments = [comment];
  awaited.comments = [comment];

  // Figure out what is imported
  root.find(j.ImportDeclaration, { source: { value: importPath } }).forEach((path) => {
    importedSpecifierNames.push(...path.node.specifiers.map((specifier) => specifier.local.name));
  });

  ///////////////////////////////////
  // Helpers
  /////////////////////////////////
  function hasDetachedReactivity(bodyBlock) {
    let expressionStatement = bodyBlock.body.find((exp, index) => {
      let { expression } = exp;

      if (!expression) return;

      if (expression.type === 'AwaitExpression' || expression.type === 'YieldExpression') {
        let { argument } = expression;

        if (argument.type === 'CallExpression') {
          let { callee } = argument;

          if (callee.type !== 'MemberExpression') {
            // If the task starts with an await/yield
            // we don't need to add one ourselves
            return index === 0 /* likely? */;
          }

          return callee.property.name === 'resolve' && callee.object.name === 'Promise';
        }
      }
    });

    return Boolean(expressionStatement);
  }

  function detachReactivityFrom(node) {
    let allowed = ['FunctionExpression', 'ArrowFunctionExpression', 'ClassMethod'];

    if (!allowed.includes(node.type)) return;

    let bodyBlock = node.body;

    if (hasDetachedReactivity(bodyBlock)) return;

    if (node.async) {
      bodyBlock.body.unshift(awaited);
    }

    if (node.generator) {
      bodyBlock.body.unshift(yieldyBoi);
    }
  }

  function firstMatchingDecorator(node, named = []) {
    if (!node.decorators) return;

    return node.decorators.find((decorator) => {
      let { expression } = decorator;

      switch (expression.type) {
        case 'MethodDefinition': {
        }
        case 'CallExpression': {
          let { callee } = expression;

          switch (callee.type) {
            case 'Identifier':
              return named.includes(callee.name);
            case 'MemberExpression': {
              let { object } = callee;

              return named.includes(object.callee.name);
            }
          }
        }
        case 'Identifier':
          return named.includes(expression.name);
      }
    });
  }

  function hasDecorators(node, named = []) {
    return Boolean(firstMatchingDecorator(node, named));
  }

  ///////////////////////////////////
  // Transforms
  /////////////////////////////////
  root.find(j.ClassMethod).forEach((path) => {
    let { node } = path;
    let { decorators, value } = node;
    let hasECDecorator = hasDecorators(node, importedSpecifierNames);

    if (hasECDecorator) {
      detachReactivityFrom(node);
    }
  });

  root.find(j.ClassProperty).forEach((path) => {
    let { node } = path;
    let { decorators, value } = node;

    let hasECDecorator = hasDecorators(node, importedSpecifierNames);

    if (hasECDecorator) {
      // The whole thing is *in* the decorator
      if (!value) {
        let decorator = firstMatchingDecorator(node, importedSpecifierNames);
        let { expression } = decorator;

        switch (expression.type) {
          case 'CallExpression': {
            let { callee } = expression;

            switch (callee.type) {
              case 'Identifier': {
                let fn = expression.arguments[0];

                return detachReactivityFrom(fn);
              }
              case 'MemberExpression': {
                let fn = callee.object.arguments[0];

                return detachReactivityFrom(fn);
              }

              default:
                console.error('Unhandled ClassProperty -> Call', expression.callee.type);
            }
          }
        }

        return;
      }

      switch (value.type) {
        case 'FunctionExpression': {
          return detachReactivityFrom(value);
        }
        case 'ArrowFunctionExpression': {
          return detachReactivityFrom(value);
        }
        case 'CallExpression': {
          if (value.callee.name === 'taskFor') {
            return detachReactivityFrom(value.arguments[0]);
          }
        }
      }
    }
  });

  return root.toSource();
};

module.exports.type = 'js';
module.exports.parser = 'ts';
