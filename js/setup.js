'use strict';

var FIRST_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var LAST_NAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];

var setupWindow = document.querySelector('.setup');
var setupWindowOpen = document.querySelector('.setup-open');
var setupWindowClose = setupWindow.querySelector('.setup-close');
var setupWindowOpenIcon = document.querySelector('.setup-open-icon');
var setupForm = document.querySelector('.setup-wizard-form');
var setupUserNameInput = document.querySelector('.setup-user-name');
var setupSimilarBlock = document.querySelector('.setup-similar');
var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');
var similarWizardsBlock = document.querySelector('.setup-similar-list');

var setupWizardCoat = document.querySelector('.setup-wizard .wizard-coat');
var setupWizardEyes = document.querySelector('.setup-wizard .wizard-eyes');
var setupWizardFireball = document.querySelector('.setup-fireball-wrap');

var makeRandomCharacter = function () {
  var firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  var lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  var name = (Math.random() < 0.5) ? firstName + ' ' + lastName : lastName + ' ' + firstName;
  var coatColor = COAT_COLORS[Math.floor(Math.random() * COAT_COLORS.length)];
  var eyesColor = EYES_COLORS[Math.floor(Math.random() * EYES_COLORS.length)];
  return {name: name, coatColor: coatColor, eyesColor: eyesColor};
};

var makeWizardElement = function (character) {
  var wizard = similarWizardTemplate.cloneNode(true);
  wizard.querySelector('.setup-similar-label').textContent = character.name;
  wizard.querySelector('.wizard-coat').style.fill = character.coatColor;
  wizard.querySelector('.wizard-eyes').style.fill = character.eyesColor;

  return wizard;
};

var renderWizards = function (characters) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < characters.length; i++) {
    fragment.appendChild(makeWizardElement(characters[i]));
  }

  while (similarWizardsBlock.lastElementChild) {
    similarWizardsBlock.removeChild(similarWizardsBlock.lastElementChild);
  }
  similarWizardsBlock.appendChild(fragment);
};


var onUserNameInvalid = function () {
  if (setupUserNameInput.validity.tooShort) {
    setupUserNameInput.setCustomValidity('Слишком короткое значение (минимум ' + setupUserNameInput.minLength + ' симв.)');
  } else if (setupUserNameInput.validity.tooLong) {
    setupUserNameInput.setCustomValidity('Слишком длинное значение (максимум ' + setupUserNameInput.maxLength + ' симв.)');
  } else if (setupUserNameInput.validity.valueMissing) {
    setupUserNameInput.setCustomValidity('Обязательное поле');
  } else {
    setupUserNameInput.setCustomValidity('');
  }
};

var onUserNameInput = function () {
  var valueLength = setupUserNameInput.value.length;
  var minValueLength = setupUserNameInput.minLength;
  var maxValueLength = setupUserNameInput.maxLength;

  if (valueLength < minValueLength) {
    setupUserNameInput.setCustomValidity('Ещё ' + (minValueLength - valueLength) + ' симв. (минимум ' + minValueLength + ')');
  } else if (valueLength > maxValueLength) {
    setupUserNameInput.setCustomValidity('Удалите лишние ' + (valueLength - maxValueLength) + ' симв. (максимум ' + maxValueLength + ')');
  } else {
    setupUserNameInput.setCustomValidity('');
  }
};

var onSetupWindowKeyDown = function (evt) {
  if (evt.key === 'Escape' && document.activeElement !== setupUserNameInput) {
    evt.preventDefault();
    closeSetupWindow();
  }
};

var onSetupCloseClick = function () {
  closeSetupWindow();
};

var onSetupCloseKeyDown = function (evt) {
  if (evt.key === 'Enter') {
    closeSetupWindow();
  }
};

var openSetupWindow = function () {
  var characters = [];
  for (var i = 0; i < 4; i++) {
    characters.push(makeRandomCharacter());
  }

  renderWizards(characters);

  setupSimilarBlock.classList.remove('hidden');
  setupWindow.classList.remove('hidden');

  window.addEventListener('keydown', onSetupWindowKeyDown);
  setupWindowClose.addEventListener('click', onSetupCloseClick);
  setupWindowClose.addEventListener('keydown', onSetupCloseKeyDown);
  setupUserNameInput.addEventListener('invalid', onUserNameInvalid);
  setupUserNameInput.addEventListener('input', onUserNameInput);
  setupWizardCoat.addEventListener('click', onWizardCoatClick);
  setupWizardEyes.addEventListener('click', onWizardEyesClick);
  setupWizardFireball.addEventListener('click', onWizardFireballClick);
};

var closeSetupWindow = function () {
  setupWindow.classList.add('hidden');

  window.removeEventListener('keydown', onSetupWindowKeyDown);
  setupWindowClose.removeEventListener('click', onSetupCloseClick);
  setupWindowClose.removeEventListener('keydown', onSetupCloseKeyDown);
  setupUserNameInput.removeEventListener('invalid', onUserNameInvalid);
  setupUserNameInput.removeEventListener('input', onUserNameInput);
  setupWizardCoat.removeEventListener('click', onWizardCoatClick);
  setupWizardEyes.removeEventListener('click', onWizardEyesClick);
  setupWizardFireball.removeEventListener('click', onWizardFireballClick);
};

var onSetupOpenClick = function () {
  openSetupWindow();
};

var onSetupOpenIconKeyDown = function (evt) {
  if (evt.key === 'Enter') {
    openSetupWindow();
  }
};

var makeColorClickEvent = function (element, colorProperty, colors, inputName) {
  var input = setupForm.elements[inputName];
  return function () {
    var newColor = colors[Math.floor(Math.random() * colors.length)];
    element.style[colorProperty] = newColor;
    input.value = newColor;
  };
};

var onWizardCoatClick = makeColorClickEvent(setupWizardCoat, 'fill', COAT_COLORS, 'coat-color');
var onWizardEyesClick = makeColorClickEvent(setupWizardEyes, 'fill', EYES_COLORS, 'eyes-color');
var onWizardFireballClick = makeColorClickEvent(setupWizardFireball, 'backgroundColor', FIREBALL_COLORS, 'fireball-color');

setupWindowOpen.addEventListener('click', onSetupOpenClick);
setupWindowOpenIcon.addEventListener('keydown', onSetupOpenIconKeyDown);
