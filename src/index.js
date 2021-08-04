import Formurai from './Formurai';
import {rules, registrationErrors} from './testData/config';

const form = document.querySelector('#test-form');

const rule = {
  name: 'strong_password',
  rules: [{length_between: [15, 20]}],
  error: 'WEAK_PASSWORD'
}

const additionalRules = [
  {
    name: 'strong_password',
    rules: {length_between: [15, 20]},
    error: 'WEAK_PASSWORD'
  },
  {
    name: 'super_password',
    rules: {length_between: [5, 10]},
    error: 'NOT_STRONG_PASSWORD'
  }
]

const test = new Formurai(form);
test.init(rules, registrationErrors);
test.addRule(rule);
test.changeState('wq')
