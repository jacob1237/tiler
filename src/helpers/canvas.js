/**
 * Reset canvas context
 *
 * @param {CanvasRenderingContext2D} ctx 
 */
export function clearCanvas(ctx) {
    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
