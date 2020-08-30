import { clearCanvas } from './helpers/canvas';

/**
 * Draw a single tile to the buffer
 *
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Image[]} tiles 
 * @param {number} tileWidth 
 * @param {number} tileHeight
 * @param {number} margin
 */
function drawTile(ctx, tiles, tileWidth, tileHeight, margin) {
    const img = tiles[Math.floor(Math.random() * tiles.length)];

    const x = tileWidth + margin;
    const cx = tileWidth / 2, cy = tileHeight / 2;

    ctx.save();

    ctx.translate(cx, cy);
    ctx.rotate((Math.PI / 180) * Math.round(Math.random()) * 180);
    ctx.scale(1, Math.random() < 0.5 ? -1 : 1);
    ctx.translate(-cx, -cy);

    ctx.drawImage(img, 0, 0, tileWidth, tileHeight);
    ctx.restore();

    ctx.translate(x, 0);
}

/**
 * Draw entire texture onto specified canvas
 *
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} width
 * @param {number} height
 * @param {number} cols
 * @param {number} rows
 * @param {number} margin
 * @param {Image[]} tiles
 * @param {CallableFunction} offsetFunc
 */
export function drawTexture(ctx, width, height, cols, rows, margin, tiles, offsetFunc) {
    const tileWidth = (width - (margin * cols)) / cols;
    const tileHeight = Math.round((height - (margin * rows)) / rows, 2);

    const canvas = ctx.canvas;
    const buffer = document.createElement('canvas');
    const bufferCtx = buffer.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    buffer.width = (tileWidth + margin) * cols;
    buffer.height = tileHeight;

    clearCanvas(ctx);

    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
        clearCanvas(bufferCtx);

        for (let col = 0; col < cols; col++) {
            drawTile(bufferCtx, tiles, tileWidth, tileHeight, margin);
        }

        const offsetX = offsetFunc(row, tileWidth);

        ctx.save();
        ctx.translate(offsetX, 0);
        ctx.fillStyle = ctx.createPattern(buffer, 'repeat-x');
        ctx.fillRect(-offsetX, 0, canvas.width, buffer.height);
        ctx.restore();

        ctx.translate(0, tileHeight + margin);
    }
}
