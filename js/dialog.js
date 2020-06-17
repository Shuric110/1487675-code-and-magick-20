'use strict';

(function () {

  var openDialog = function (dlg, dlgCloseButtons, dlgMoveHandles, closeCallback) {

    var closeDialog = function () {
      if (closeCallback && !closeCallback()) {
        return;
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
    };

    var onGlobalKeyDown = function (evt) {
      if (evt.key === 'Escape') {
        closeDialog();
      }
    };

    var onCloseClick = function () {
      closeDialog();
    };

    var onCloseKeyDown = function (evt) {
      if (evt.key === 'Enter') {
        closeDialog();
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

    dlg.style.top = '';
    dlg.style.left = '';
    dlg.classList.remove('hidden');
  };


  window.dialog = {
    openDialog: openDialog
  };

})();
