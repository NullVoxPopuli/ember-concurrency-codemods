'use strict';

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

module.exports = { hasDecorators, firstMatchingDecorator };
