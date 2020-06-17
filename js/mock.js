'use strict';

(function () {
  var FIRST_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
  var LAST_NAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
  var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
  var WIZARDS_MOCK_LENGTH = 4;

  var makeRandomWizard = function () {
    var firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    var lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    var name = (Math.random() < 0.5) ? firstName + ' ' + lastName : lastName + ' ' + firstName;
    var coatColor = COAT_COLORS[Math.floor(Math.random() * COAT_COLORS.length)];
    var eyesColor = EYES_COLORS[Math.floor(Math.random() * EYES_COLORS.length)];
    return {name: name, coatColor: coatColor, eyesColor: eyesColor};
  };

  var makeWizards = function () {
    var wizards = [];
    for (var i = 0; i < WIZARDS_MOCK_LENGTH; i++) {
      wizards.push(makeRandomWizard());
    }
    return wizards;
  };

  window.mock = {
    makeWizards: makeWizards
  };
})();
