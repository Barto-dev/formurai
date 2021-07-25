import Formurai from './Formurai';
import {rules} from './testData/config';

const form = document.querySelector('#test-form');

const test = new Formurai(form);
test.init(rules);
