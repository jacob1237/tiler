/**
 * Random 180 degree rotation and X-axis flipping
 *
 * @param {number} row Row number
 * @param {number} col Column number
 * @returns {number[]} Transformation data: [rotationAngle, scaleX, scaleY]
 */
export function random(row, col) {
    return [
        (Math.PI / 180) * Math.round(Math.random()) * 180,
        1,
        Math.random() < 0.5 ? -1 : 1,
    ];
}
