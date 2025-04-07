// src/index.js
import { add, subtract } from './math.js';
import { log, error } from './logger.js';

const num1 = 10;
const num2 = 5;

const sum = add(num1, num2);
const difference = subtract(num1, num2);

log(`The sum of ${num1} and ${num2} is ${sum}`);
error(`The difference between ${num1} and ${num2} is ${difference}`);
