'use strict';

(function () {

  var LOAD_URL = 'https://javascript.pages.academy/code-and-magick/data';
  var SAVE_URL = 'https://javascript.pages.academy/code-and-magick';

  var QUERY_TIMEOUT = 5000;
  var HTTP_OK = 200;
  var ERROR_STATUS = 'Неверный код ответа сервера: ';
  var ERROR_CONNECTION = 'Не удаётся соединиться с сервером';
  var ERROR_TIMEOUT = 'Таймаут соединения (' + QUERY_TIMEOUT + 'мс)';

  var createXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = QUERY_TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_OK) {
        onLoad(xhr.response);
      } else {
        onError(ERROR_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(ERROR_CONNECTION);
    });

    xhr.addEventListener('timeout', function () {
      onError(ERROR_TIMEOUT);
    });

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = createXHR(onLoad, onError);

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = createXHR(onLoad, onError);

    xhr.open('POST', SAVE_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
