'use strict';

var FIRST_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var LAST_NAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];

var setupWindow = document.querySelector('.setup');
var setupSimilarBlock = document.querySelector('.setup-similar');
var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');
var similarWizardsBlock = document.querySelector('.setup-similar-list');

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

  similarWizardsBlock.appendChild(fragment);
};

setupWindow.classList.remove('hidden');

var characters = [];
for (var i = 0; i < 4; i++) {
  characters.push(makeRandomCharacter());
}

renderWizards(characters);

setupSimilarBlock.classList.remove('hidden');
