'use strict';

(function () {
  var MAX_SIMILAR_WIZARDS = 4;

  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');
  var similarWizardsBlock = document.querySelector('.setup-similar');
  var similarWizardsList = document.querySelector('.setup-similar-list');

  var coatColor;
  var eyesColor;

  var allWizards;
  var allWizardsLoaded = false;
  var isLoading = false;

  var ensureWizardsLoaded = function () {
    if (allWizardsLoaded) {
      return true;
    }
    if (isLoading) {
      return false;
    }
    isLoading = true;

    window.backend.load(
        function (data) {
          // onLoad
          isLoading = false;
          allWizards = data;
          allWizardsLoaded = true;
          similarWizardsBlock.classList.remove('hidden');
          renderSimilarWizards();
        },
        function (error) {
          // onError
          isLoading = false;
          window.dialog.showError(error);
        }
    );

    return false;
  };

  var makeWizardElement = function (character) {
    var wizard = similarWizardTemplate.cloneNode(true);
    wizard.querySelector('.setup-similar-label').textContent = character.name;
    wizard.querySelector('.wizard-coat').style.fill = character.colorCoat;
    wizard.querySelector('.wizard-eyes').style.fill = character.colorEyes;

    return wizard;
  };

  var renderWizards = function (wizards) {
    var oldItems = similarWizardsList.querySelectorAll('.setup-similar-item');
    for (var i = 0; i < oldItems.length; i++) {
      similarWizardsList.removeChild(oldItems[i]);
    }

    var fragment = document.createDocumentFragment();
    for (i = 0; i < wizards.length; i++) {
      fragment.appendChild(makeWizardElement(wizards[i]));
    }
    similarWizardsList.appendChild(fragment);
  };

  var getSimilarity = function (wizard) {
    var similarity = 0;
    if (wizard.colorCoat === coatColor) {
      similarity += 2;
    }
    if (wizard.colorEyes === eyesColor) {
      similarity += 1;
    }
    return similarity;
  };

  var compareWizards = function (a, b) {
    var result = getSimilarity(b) - getSimilarity(a);
    if (result === 0) {
      if (a.name > b.name) {
        result = 1;
      } else if (a.name < b.name) {
        result = -1;
      }
    }
    return result;
  };

  var renderSimilarWizards = function () {
    renderWizards(allWizards
      .slice()
      .sort(compareWizards)
      .slice(0, MAX_SIMILAR_WIZARDS));
  };

  var updateWizards = function (newCoatColor, newEyesColor) {
    coatColor = newCoatColor;
    eyesColor = newEyesColor;

    if (ensureWizardsLoaded()) {
      renderSimilarWizards();
    }
  };

  window.wizards = {
    updateWizards: updateWizards
  };


})();
