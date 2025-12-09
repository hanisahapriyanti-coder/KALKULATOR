// script.js
const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

// fungsi hitung
function calculate(n1, operator, n2) {
  const num1 = parseFloat(n1);
  const num2 = parseFloat(n2);

  if (Number.isNaN(num1) || Number.isNaN(num2)) return '0';

  switch (operator) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case '*': return num1 * num2;
    case '/': return num2 === 0 ? 'Error' : num1 / num2;
    default: return num2;
  }
}

// input digit
function inputDigit(digit) {
  if (waitingForSecondValue) {
    display.value = digit;
    waitingForSecondValue = false;
  } else {
    display.value = (display.value === '0') ? digit : display.value + digit;
  }
}

// input decimal
function inputDecimal(dot) {
  if (waitingForSecondValue) {
    display.value = '0.';
    waitingForSecondValue = false;
    return;
  }
  if (!display.value.includes(dot)) {
    display.value += dot;
  }
}

// handle operator (untuk + - * /)
function handleOperator(nextOperator) {
  const inputValue = display.value;

  if (firstValue === null && nextOperator !== '=') {
    firstValue = inputValue;
  } else if (operator && !waitingForSecondValue) {
    // lakukan chaining operasi (mis. 2 + 3 + ...)
    const result = calculate(firstValue, operator, inputValue);
    display.value = String(result);
    firstValue = String(result);
  }

  waitingForSecondValue = true;
  operator = (nextOperator === '=') ? null : nextOperator;
}

// reset
function resetCalculator() {
  display.value = '0';
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
}

// event listener tombol
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) return;

  const value = target.value;

  // operator khusus '=' diproses sendiri
  if (value === 'all-clear') {
    resetCalculator();
    return;
  }

  if (value === '=') {
    if (operator && firstValue !== null && !waitingForSecondValue) {
      const result = calculate(firstValue, operator, display.value);
      display.value = String(result);
      firstValue = null;
      operator = null;
      waitingForSecondValue = true;
    }
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    // jika user menekan operator setelah operator (tanpa angka baru), ubah operator saja
    if (waitingForSecondValue && operator && firstValue !== null) {
      operator = value;
      return;
    }
    handleOperator(value);
    return;
  }

  if (value === '.') {
    inputDecimal(value);
    return;
  }

  // angka
  if (!Number.isNaN(parseFloat(value))) {
    inputDigit(value);
    return;
  }
});

// inisialisasi
resetCalculator();