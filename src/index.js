import Formurai from './Formurai';
import {rules,rules2, registrationErrors} from './testData/config';

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

const test = new Formurai(form, {
  multiStep: true
});
test.init({step1: rules, step2: rules2}, {step1: registrationErrors, step2: registrationErrors}, 'step1');
test.addRule(rule);
test.changeState('step2')
test.changeState('step1')
