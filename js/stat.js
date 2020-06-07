'use strict';

var CLOUD_LEFT = 100;
var CLOUD_TOP = 10;
var CLOUD_WIDTH = 420;
var CLOUD_HEIGHT = 270;
var CLOUD_HOLLOW = 10;
var CLOUD_SHADOW_OFFSET = 10;

var STAT_PADDING = 15;
var TEXT_LINE_HEIGHT = 18;

var BAR_WIDTH = 40;
var BAR_GAP = 50;
var BAR_MAX_HEIGHT = 150;
var BAR_LABEL_GAP = 2;

var barBaseLine = CLOUD_TOP + CLOUD_HEIGHT - STAT_PADDING - TEXT_LINE_HEIGHT - BAR_LABEL_GAP;

var renderCloudShape = function (ctx, left, top, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + CLOUD_WIDTH / 2, top + CLOUD_HOLLOW);
  ctx.lineTo(left + CLOUD_WIDTH, top);
  ctx.lineTo(left + CLOUD_WIDTH - CLOUD_HOLLOW, top + CLOUD_HEIGHT / 2);
  ctx.lineTo(left + CLOUD_WIDTH, top + CLOUD_HEIGHT);
  ctx.lineTo(left + CLOUD_WIDTH / 2, top + CLOUD_HEIGHT - CLOUD_HOLLOW);
  ctx.lineTo(left, top + CLOUD_HEIGHT);
  ctx.lineTo(left + CLOUD_HOLLOW, top + CLOUD_HEIGHT / 2);
  ctx.lineTo(left, top);
  ctx.closePath();
  ctx.fill();
};

var getMaxArrayElement = function (arr) {
  var maxValue = arr[0];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
    }
  }
  return maxValue;
};

window.renderStatistics = function (ctx, playerNames, playerTimes) {
  renderCloudShape(ctx, CLOUD_LEFT + CLOUD_SHADOW_OFFSET, CLOUD_TOP + CLOUD_SHADOW_OFFSET, 'rgba(0, 0, 0, 0.7)');
  renderCloudShape(ctx, CLOUD_LEFT, CLOUD_TOP, 'white');

  ctx.font = '16px PT Mono';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.fillStyle = '#000';
  ctx.fillText('Ура вы победили!', CLOUD_LEFT + CLOUD_WIDTH / 2, CLOUD_TOP + STAT_PADDING);
  ctx.fillText('Список результатов:', CLOUD_LEFT + CLOUD_WIDTH / 2, CLOUD_TOP + STAT_PADDING + TEXT_LINE_HEIGHT);

  var playerCount = playerNames.length;
  var barCenterStartX = CLOUD_LEFT + (CLOUD_WIDTH - (BAR_WIDTH + BAR_GAP) * (playerCount - 1)) / 2;
  var maxPlayerTime = getMaxArrayElement(playerTimes);

  for (var i = 0; i < playerCount; i++) {
    var barCenterX = barCenterStartX + (BAR_WIDTH + BAR_GAP) * i;
    var barHeight = BAR_MAX_HEIGHT * playerTimes[i] / maxPlayerTime;

    ctx.fillStyle = '#000';
    ctx.fillText(playerNames[i], barCenterX, barBaseLine + BAR_LABEL_GAP);
    ctx.fillText(Math.round(playerTimes[i]), barCenterX, barBaseLine - barHeight - TEXT_LINE_HEIGHT);

    ctx.fillStyle = (playerNames[i] === 'Вы') ?
      'rgba(255, 0, 0, 1)' :
      'hsl(240, ' + (Math.round(Math.random() * 100)) + '%, 50%)';
    ctx.fillRect(barCenterX - BAR_WIDTH / 2, barBaseLine - barHeight, BAR_WIDTH, barHeight);
  }
};
