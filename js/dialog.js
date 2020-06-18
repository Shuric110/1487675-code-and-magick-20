'use strict';

(function () {

  var MESSAGE_FADEOUT_DELAY = 1000;
  var KEY_ENTER = 'Enter';
  var KEY_ESCAPE = 'Escape';
  var ACTION_CANCEL = 'cancel';

  var openDialog = function (dlg, dlgCloseButtons, dlgMoveHandles, closeCallback) {

    var closeDialog = function (action) {
      if (closeCallback && !closeCallback(action)) {
        return false;
      }

      for (var i = 0; i < dlgCloseButtons.length; i++) {
        dlgCloseButtons[i].removeEventListener('click', onCloseClick);
        dlgCloseButtons[i].removeEventListener('keydown', onCloseKeyDown);
      }
      for (i = 0; i < dlgMoveHandles.length; i++) {
        dlgMoveHandles[i].addEventListener('mousedown', onMouseDown);
      }
      window.removeEventListener('keydown', onGlobalKeyDown);

      dlg.classList.add('hidden');
      delete dlg.closeDialog;

      return true;
    };

    var onGlobalKeyDown = function (evt) {
      if (evt.key === KEY_ESCAPE) {
        closeDialog(ACTION_CANCEL);
      }
    };

    var onCloseClick = function () {
      closeDialog(ACTION_CANCEL);
    };

    var onCloseKeyDown = function (evt) {
      if (evt.key === KEY_ENTER) {
        closeDialog(ACTION_CANCEL);
      }
    };

    var onMouseDown = function (evt) {
      evt.preventDefault();
      var baseCoords = {
        x: dlg.offsetLeft - evt.clientX,
        y: dlg.offsetTop - evt.clientY
      };
      var dragged = false;

      var onMouseMove = function (evtMove) {
        evtMove.preventDefault();
        dlg.style.left = (baseCoords.x + evtMove.clientX) + 'px';
        dlg.style.top = (baseCoords.y + evtMove.clientY) + 'px';
        dragged = true;
      };

      var onMouseUp = function (evtUp) {
        evtUp.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function (evtClick) {
            evtClick.preventDefault();
            evt.target.removeEventListener('click', onClickPreventDefault);
          };
          evt.target.addEventListener('click', onClickPreventDefault);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    for (var i = 0; i < dlgCloseButtons.length; i++) {
      dlgCloseButtons[i].addEventListener('click', onCloseClick);
      dlgCloseButtons[i].addEventListener('keydown', onCloseKeyDown);
    }
    for (i = 0; i < dlgMoveHandles.length; i++) {
      dlgMoveHandles[i].addEventListener('mousedown', onMouseDown);
    }
    window.addEventListener('keydown', onGlobalKeyDown);

    dlg.closeDialog = closeDialog;
    dlg.style.top = '';
    dlg.style.left = '';
    dlg.classList.remove('hidden');
  };

  var closeDialog = function (dlg, action) {
    if (dlg.closeDialog) {
      return dlg.closeDialog(action);
    }
    return false;
  };


  var showError = function (errorText) {
    var errorWindow = document.createElement('DIV');
    errorWindow.classList.add('error-message');
    errorWindow.textContent = errorText;
    document.body.appendChild(errorWindow);

    var onMouseEnter = function () {
      errorWindow.removeEventListener('mouseenter', onMouseEnter);
      errorWindow.classList.add('fade-out');
      window.setTimeout(function () {
        document.body.removeChild(errorWindow);
      }, MESSAGE_FADEOUT_DELAY);
    };

    errorWindow.addEventListener('mouseenter', onMouseEnter);
  };


  window.dialog = {
    ACTION_CANCEL: ACTION_CANCEL,

    openDialog: openDialog,
    closeDialog: closeDialog,
    showError: showError
  };

})();
