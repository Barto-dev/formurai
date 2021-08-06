import Formurai from 'formurai';
import {changeCurrentStep} from '../demo/changeCurrentStep';


const rules = {
  'step_1': {
    name: 'required',
    surname: 'required'
  },
  'step_2': {},
  'step_3': {},
  'step_4': {},
}

const errors = {
  'step_1': {
    name: {REQUIRED: 'Name required'},
    surname: {REQUIRED: 'Surname required'},
  },
  'step_2': {},
  'step_3': {},
  'step_4': {},
}

const multiStepForm = document.querySelector('#multistep-form');

const validator = new Formurai(multiStepForm, {
  multiStep: true
})

validator.init(rules, errors, 'step_1');

function stepHandler() {
  // in the first step, we run the form validation
  validator.checkForm();
  if (validator.isFormValid) {
    // If the validation of this step was successful, we move on to the next
    // abstract from calling and the implementation of this function,
    // it just changes the interface, and has nothing to do with validation
    changeCurrentStep(this);

    // focus on this step
    const currentStep = document.querySelector('[data-step]').dataset.step;
    // we get string like 'step_1' or 'step_2'
    validator.changeState(`step_${currentStep}`);
  }
}

const stepButtons = document.querySelectorAll('[data-step]');

stepButtons.forEach(button => button.addEventListener('click', stepHandler));
