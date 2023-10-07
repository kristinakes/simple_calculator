const calcDisplay = document.querySelector('.display');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.querySelector('.clear');
const clearEBtn = document.querySelector('.clearEntry');
const deleteBtn = document.querySelector('.delete');
const negativeBtn = document.querySelector('.negative');
const perctBtn = document.querySelector('.percentage');

//Operators object to make calculation based on operators
const calculate = {
    '/': (firstNumber, secondNumber) => firstNumber / secondNumber,
    '*': (firstNumber, secondNumber) => firstNumber * secondNumber,
    '+': (firstNumber, secondNumber) => (firstNumber) + (secondNumber),
    '-': (firstNumber, secondNumber) => (firstNumber) - (secondNumber),
    'x2': (secondNumber) => secondNumber * secondNumber,
    '1/x': (secondNumber) => 1 / secondNumber,
    'xsqrt': (secondNumber) => Math.sqrt(secondNumber),
    '=': (firstNumber, secondNumber) => secondNumber,

};

//Variables to use in calculation and update them
let firstValue = 0;
let waitingNextValue = false;
let operatorValue= '';

//Function to show the value entered with buttons on display
function showNumberValue(number) {
    //Replace current display value if first value entered
    if (waitingNextValue) {
        calcDisplay.textContent = number;
        waitingNextValue = false;
    } else {
        const displayValue = calcDisplay.textContent;
        //If there is no value yet then show number
        if(displayValue === '0') {
            calcDisplay.textContent = number;
        //If already some number added then concatinate with new addition
        } else {
            calcDisplay.textContent = displayValue + number;
        }
    }
}

//Calculation function with entered operator
function useOperator(operator) {
    const currentValue = Number(calcDisplay.textContent);
    //Prevent multiple operators
    if ((operatorValue && !operatorValue.includes('x')) && waitingNextValue) {
        operatorValue = operator;
        return;
    };

    //assign first value if no value
    if(!firstValue) {
        firstValue = currentValue;
    } else if (operatorValue.includes('x')) {
        const calculateX = calculate[operatorValue](currentValue);
        firstValue = calculateX;
        calcDisplay.textContent = firstValue;
    }
    else {
        const calculation = calculate[operatorValue](firstValue, currentValue);
        calcDisplay.textContent = calculation;
        firstValue = calculation;
    }
    //Ready for next value and to store operator
    waitingNextValue = true;
    operatorValue = operator;
}

//Add decimal to number
function addDecimal() {
    //If operator pressed avoid adding decimal
    if (waitingNextValue
    ) return;
    //Add decimal only if there is no decimal yet
    if(!calcDisplay.textContent.includes('.')) {
        calcDisplay.textContent = `${calcDisplay.textContent}.`;
    }
}

//Change number to positive/negative
//works with first time etnered values. after = the first value is not updated
function toNegativePositive() {
    if (+calcDisplay.textContent > 0) {
        calcDisplay.textContent = -Math.abs(calcDisplay.textContent);
        if (operatorValue == '=') {
            firstValue = +calcDisplay.textContent;
        };
    } else {
        calcDisplay.textContent = Math.abs(calcDisplay.textContent);
        if(operatorValue == '=') {
            firstValue = +calcDisplay.textContent;
        }
    }
    
}

//Change number to ppercentage
function toPercentage() {
    if (firstValue == 0) {
        calcDisplay.textContent = +calcDisplay.textContent / 100;
    } else {
        calcDisplay.textContent = firstValue * (+calcDisplay.textContent / 100);
    }
}

//Clear function and all values to reset display
function clearAll() {
    firstValue = 0;
    waitingNextValue = false;
    operatorValue= '';
    calcDisplay.textContent = '0';
}

//Clear entry only 
function clearEntry() {
    calcDisplay.textContent = '0';
    waitingNextValue = false;
}

//Delete last number on display
function deletLast() {
    let lastValue = calcDisplay.textContent;
    if (operatorValue == '=') {
        calcDisplay.textContent = lastValue.slice(0, -1);
        firstValue = calcDisplay.textContent;
        waitingNextValue = false;
    } else {
         calcDisplay.textContent = lastValue.slice(0, -1);
    }
}

//Dinamicaly add eventlisteners to buttons based on class and pass their value as function argument
inputBtns.forEach((inputBtn) => {
    if(inputBtn.classList.contains('number')) {
        inputBtn.addEventListener('click', () => showNumberValue(inputBtn.value))
    } else if (inputBtn.classList.contains('operator')) {
        inputBtn.addEventListener('click', () => useOperator(inputBtn.value))
    } else if(inputBtn.classList.contains('decimal')) {
        inputBtn.addEventListener('click', () => addDecimal())
    }
});

//Event listener for clear function
clearBtn.addEventListener('click', clearAll);
clearEBtn.addEventListener('click', clearEntry);
deleteBtn.addEventListener('click', deletLast);
negativeBtn.addEventListener('click', toNegativePositive);
perctBtn.addEventListener('click', toPercentage);

