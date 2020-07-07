'use strict';

(function () {

  var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
  var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];
  var IMAGE_MIME_TYPE = 'image/';
  var FILE_WRONG_TYPE_ERROR = 'Выбранный файл не является изображением';

  var setupWindow = document.querySelector('.setup');
  var setupWindowOpen = document.querySelector('.setup-open');
  var setupWindowClose = setupWindow.querySelector('.setup-close');
  var setupWindowUpload = setupWindow.querySelector('.upload');
  var setupWindowOpenIcon = document.querySelector('.setup-open-icon');
  var setupForm = document.querySelector('.setup-wizard-form');
  var setupUserNameInput = document.querySelector('.setup-user-name');
  var setupAvatarPicture = document.querySelector('.setup-user-pic');

  var setupCoatColorInput = setupForm.elements['coat-color'];
  var setupEyesColorInput = setupForm.elements['eyes-color'];
  var setupFireballColorInput = setupForm.elements['fireball-color'];
  var setupAvatarInput = setupForm.elements['avatar'];

  var setupWizardCoat = document.querySelector('.setup-wizard .wizard-coat');
  var setupWizardEyes = document.querySelector('.setup-wizard .wizard-eyes');
  var setupWizardFireball = document.querySelector('.setup-fireball-wrap');

  var isSaving = false;


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

  var onAvatarFileChange = function () {
    var file = setupAvatarInput.files[0];
    if (!file.type.startsWith(IMAGE_MIME_TYPE)) {
      window.dialog.showError(FILE_WRONG_TYPE_ERROR);
      return;
    }

    var reader = new FileReader();
    reader.addEventListener('load', function (evt) {
      setupAvatarPicture.src = evt.target.result;
    });
    reader.readAsDataURL(file);
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

  var doUpdateWizardsDebounced = window.debounce(window.wizards.updateWizards);

  var updateWizards = function () {
    doUpdateWizardsDebounced(setupCoatColorInput.value, setupEyesColorInput.value);
  };

  var openSetupWindow = function () {
    updateWizards();

    setupUserNameInput.addEventListener('invalid', onUserNameInvalid);
    setupUserNameInput.addEventListener('input', onUserNameInput);
    setupWizardCoat.addEventListener('click', onWizardCoatClick);
    setupWizardEyes.addEventListener('click', onWizardEyesClick);
    setupWizardFireball.addEventListener('click', onWizardFireballClick);
    setupForm.addEventListener('submit', onSubmit);
    setupAvatarInput.addEventListener('change', onAvatarFileChange);

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
      setupAvatarInput.removeEventListener('change', onAvatarFileChange);

      return true;
    });
  };

  var onSetupOpenClick = function () {
    openSetupWindow();
  };

  var onSetupOpenIconKeyDown = function (evt) {
    if (evt.key === 'Enter') {
      openSetupWindow();
    }
  };

  var makeColorClickEvent = function (element, colorProperty, colors, input) {
    var currentIndex = colors.indexOf(input.value);
    return function () {
      currentIndex++;
      if (currentIndex >= colors.length) {
        currentIndex = 0;
      }
      var newColor = colors[currentIndex];
      element.style[colorProperty] = newColor;
      input.value = newColor;
      updateWizards();
    };
  };

  var onWizardCoatClick = makeColorClickEvent(setupWizardCoat, 'fill', COAT_COLORS, setupCoatColorInput);
  var onWizardEyesClick = makeColorClickEvent(setupWizardEyes, 'fill', EYES_COLORS, setupEyesColorInput);
  var onWizardFireballClick = makeColorClickEvent(setupWizardFireball, 'backgroundColor', FIREBALL_COLORS, setupFireballColorInput);

  setupWindowOpen.addEventListener('click', onSetupOpenClick);
  setupWindowOpenIcon.addEventListener('keydown', onSetupOpenIconKeyDown);

})();
