import { CanvasRenderingContext2D } from 'canvas';

import Canvas from './canvas.js';

const _drawImage = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function (img, ...args) {
  // call __ctx__ to sync image data
  if (img instanceof Canvas && img.__gl__) img.__ctx__; // eslint-disable-line no-unused-expressions
  return _drawImage.call(this, img, ...args);
};

function createCanvas(width, height, type) {
  return new Canvas(width, height, type);
}

export {
  createCanvas,
};