'use strict';

(function () {

  var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
  var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];
  var MAX_SIMILAR_WIZARDS = 4;

  var setupWindow = document.querySelector('.setup');
  var setupWindowOpen = document.querySelector('.setup-open');
  var setupWindowClose = setupWindow.querySelector('.setup-close');
  var setupWindowUpload = setupWindow.querySelector('.upload');
  var setupWindowOpenIcon = document.querySelector('.setup-open-icon');
  var setupForm = document.querySelector('.setup-wizard-form');
  var setupUserNameInput = document.querySelector('.setup-user-name');
  var setupSimilarBlock = document.querySelector('.setup-similar');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');
  var similarWizardsBlock = document.querySelector('.setup-similar-list');

  var setupWizardCoat = document.querySelector('.setup-wizard .wizard-coat');
  var setupWizardEyes = document.querySelector('.setup-wizard .wizard-eyes');
  var setupWizardFireball = document.querySelector('.setup-fireball-wrap');

  var isLoading = false;
  var isSaving = false;

  var randomInteger = function (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  var peekRandomElement = function (array) {
    var i = randomInteger(0, array.length - 1);
    var result = array[i];
    array.splice(i, 1);
    return result;
  };

  var makeWizardElement = function (character) {
    var wizard = similarWizardTemplate.cloneNode(true);
    wizard.querySelector('.setup-similar-label').textContent = character.name;
    wizard.querySelector('.wizard-coat').style.fill = character.colorCoat;
    wizard.querySelector('.wizard-eyes').style.fill = character.colorEyes;

    return wizard;
  };

  var renderWizards = function (wizards) {
    var oldItems = similarWizardsBlock.querySelectorAll('.setup-similar-item');
    for (var i = 0; i < oldItems.length; i++) {
      similarWizardsBlock.removeChild(oldItems[i]);
    }

    var fragment = document.createDocumentFragment();
    for (i = 0; i < wizards.length && i < MAX_SIMILAR_WIZARDS; i++) {
      fragment.appendChild(makeWizardElement(peekRandomElement(wizards)));
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

  var onSubmit = function (evt) {
    evt.preventDefault();

    if (isSaving) {
      return;
    }
    isSaving = true;

    window.backend.save(new FormData(setupForm),
        function () {
          // onLoad
          isSaving = false;
          window.dialog.closeDialog(setupWindow);
        },
        function (errorText) {
          // onErros
          isSaving = false;
          window.dialog.showError(errorText);
        }
    );
  };

  var openSetupWindow = function (wizardsData) {
    if (wizardsData) {
      renderWizards(wizardsData);
      setupSimilarBlock.classList.remove('hidden');
    } else {
      setupSimilarBlock.classList.add('hidden');
    }

    setupUserNameInput.addEventListener('invalid', onUserNameInvalid);
    setupUserNameInput.addEventListener('input', onUserNameInput);
    setupWizardCoat.addEventListener('click', onWizardCoatClick);
    setupWizardEyes.addEventListener('click', onWizardEyesClick);
    setupWizardFireball.addEventListener('click', onWizardFireballClick);
    setupForm.addEventListener('submit', onSubmit);

    window.dialog.openDialog(setupWindow, [setupWindowClose], [setupWindowUpload], function (action) {
      if (action === window.dialog.ACTION_CANCEL && document.activeElement === setupUserNameInput) {
        return false;
      }

      setupUserNameInput.removeEventListener('invalid', onUserNameInvalid);
      setupUserNameInput.removeEventListener('input', onUserNameInput);
      setupWizardCoat.removeEventListener('click', onWizardCoatClick);
      setupWizardEyes.removeEventListener('click', onWizardEyesClick);
      setupWizardFireball.removeEventListener('click', onWizardFireballClick);
      setupForm.removeEventListener('submit', onSubmit);

      return true;
    });
  };

  var startSetup = function () {
    if (!isLoading) {
      isLoading = true;
      window.backend.load(
          function (data) {
            // onLoad
            isLoading = false;
            openSetupWindow(data);
          },
          function (error) {
            // onError
            isLoading = false;
            window.dialog.showError(error);
          }
      );
    }
  };

  var onSetupOpenClick = function () {
    startSetup();
  };

  var onSetupOpenIconKeyDown = function (evt) {
    if (evt.key === 'Enter') {
      startSetup();
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

})();
