const prevButton = document.querySelector('.js-prev');
const nextButton = document.querySelector('.js-next');
const allSectionSteps = document.querySelectorAll('.form-step');
const submitButton = document.querySelector('#multistep-form .submit');
const MAX_STEP = 3;

export function changeCurrentStep(btn) {
  const direction = btn.classList.contains('js-prev') ? -1 : 1;
  const step = Number(btn.dataset.step) + direction;
  prevButton.dataset.step = String(step);
  nextButton.dataset.step = String(step);
  const isFirstStep = step === 1;
  const isLastStep = step === MAX_STEP;

  allSectionSteps.forEach((el) => {
    const isCurrentStep = el.classList.contains(`step-${step}`);
    el.classList.toggle('hidden', !isCurrentStep)
  });

  prevButton.classList.toggle('hidden', isFirstStep);
  nextButton.classList.toggle('hidden', isLastStep);
  submitButton.classList.toggle('hidden', !isLastStep);
}
