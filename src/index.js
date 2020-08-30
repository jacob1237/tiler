import { memoize } from './helpers/functional';
import { loadImages } from './helpers/files';
import { drawTexture } from './draw';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');

const tiles = document.getElementById('tiles');

const offsetInput = document.getElementById('offset');
const marginInput = document.getElementById('margin');

/*
 * Tile offset pattern functions:
 *
 * 0: random offset
 * 1: zero offset
 */
const offsetPatterns = [
    (row, tileWidth) => Math.floor(Math.random() * tileWidth),
    () => 0,
];

document
    .getElementById('run')
    .addEventListener('click', () => {
        loadImages(tiles.files).then((images) => {
            drawTexture(
                ctx,
                parseInt(widthInput.value),
                parseInt(heightInput.value),
                parseInt(colsInput.value),
                parseInt(rowsInput.value),
                parseInt(marginInput.value),
                images,
                memoize(offsetPatterns[parseInt(offsetInput.value)])
            );

            document.body.appendChild(canvas);
        });
    });
