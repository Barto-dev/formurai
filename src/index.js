import Formurai from './Formurai';
import {rules, registrationErrors} from './testData/config';

const form = document.querySelector('#test-form');

const rule = {
  name: 'strong_password',
  rules: {length_between: [10, 15]},
  error: 'WEAK_PASSWORD'
}

const test = new Formurai(form);
test.init(rules, registrationErrors);
test.addRule(rule);
