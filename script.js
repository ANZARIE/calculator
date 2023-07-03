function appendToDisplay(value) {
  document.getElementsByName('display')[0].value += value;
}

function deleteLastChar() {
  let display = document.getElementsByName('display')[0];
  display.value = display.value.slice(0, -1);
}

function clearDisplay() {
  document.getElementsByName('display')[0].value = '';
}

function calculate() {
  let display = document.getElementsByName('display')[0];
  let expression = display.value;

  // Replace special symbols with their JavaScript equivalents
  expression = expression.replace(/%/g, '/100');
  
  try {
      let result = evaluateExpression(expression);
      display.value = result;
  } catch (error) {
      display.value = 'Error';
  }
}

function evaluateExpression(expression) {
  let operators = ['+', '-', '*', '/'];
  let operatorStack = [];
  let operandStack = [];

  // Tokenize the expression
  let tokens = expression.split(/(\+|\-|\*|\/)/);

  // Process each token
  tokens.forEach(token => {
      token = token.trim();

      // Ignore empty tokens
      if (token === '') {
          return;
      }

      if (operators.includes(token)) {
          // Operator token
          while (
              operatorStack.length > 0 &&
              operators.indexOf(operatorStack[operatorStack.length - 1]) >= operators.indexOf(token)
          ) {
              let operator = operatorStack.pop();
              let operand2 = operandStack.pop();
              let operand1 = operandStack.pop();

              let result = applyOperator(operator, operand1, operand2);
              operandStack.push(result);
          }

          operatorStack.push(token);
      } else {
          // Operand token
          operandStack.push(parseFloat(token));
      }
  });

  // Process remaining operators
  while (operatorStack.length > 0) {
      let operator = operatorStack.pop();
      let operand2 = operandStack.pop();
      let operand1 = operandStack.pop();

      let result = applyOperator(operator, operand1, operand2);
      operandStack.push(result);
  }

  if (operandStack.length !== 1) {
      throw new Error('Invalid expression');
  }

  return operandStack[0];
}

function applyOperator(operator, operand1, operand2) {
  switch (operator) {
      case '+':
          return operand1 + operand2;
      case '-':
          return operand1 - operand2;
      case '*':
          return operand1 * operand2;
      case '/':
          return operand1 / operand2;
      default:
          throw new Error('Invalid operator');
  }
}