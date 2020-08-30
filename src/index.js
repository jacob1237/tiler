import { memoize } from './helpers/functional';
import { loadImages } from './helpers/files';
import { random as randomOffset, zero as zeroOffset } from './transform/offset';
import { random as randomOrientation } from './transform/orientation';
import { drawTexture } from './draw';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const canvasNorm = document.createElement('canvas');
const ctxNorm = canvasNorm.getContext('2d');

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');

const tiles = document.getElementById('tiles');

const offsetInput = document.getElementById('offset');
const marginInput = document.getElementById('margin');

// Tile offset pattern functions
const offsetPatterns = [randomOffset, zeroOffset];

document
    .getElementById('run')
    .addEventListener('click', () => {
        loadImages(tiles.files).then((images) => {
            const config = {
                width: parseInt(widthInput.value),
                height: parseInt(heightInput.value),
                cols: parseInt(colsInput.value),
                rows: parseInt(rowsInput.value),
                margin: parseInt(marginInput.value),
            }

            const offsetFunc = memoize(offsetPatterns[parseInt(offsetInput.value)]);
            const transformFunc = memoize(randomOrientation);
            const tileFunc = memoize((row, col, images) => Math.floor(Math.random() * images.length));

            drawTexture(ctx, config, images, tileFunc, transformFunc, offsetFunc);
            drawTexture(ctxNorm, config, images, tileFunc, transformFunc, offsetFunc);

            document.body.appendChild(canvas);
            document.body.appendChild(canvasNorm);
        });
    });
