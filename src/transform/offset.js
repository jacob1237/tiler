/**
 * Random horizontal offset for row tiles
 *
 * @param {number} row 
 * @param {nubmer} tileWidth 
 */
export function random(row, tileWidth) {
    return Math.floor(Math.random() * tileWidth);
}

/**
 * Zero offset
 */
export function zero() {
    return 0;
}
