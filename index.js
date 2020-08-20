(function () {
    const MARGIN_PX = 2;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const canvasBuf = document.createElement('canvas');
    const ctxBuf = canvasBuf.getContext('2d');

    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');

    const tiles = document.getElementById('tiles');

    /**
     * Asynchronously read files and return a promise
     *
     * @param {string[]} files 
     */
    function loadImages(files) {
        return Promise.all(
            [...files].map((file) => new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    resolve(img);
                };

                reader.onerror = (e) => {
                    reject(e);
                }

                reader.readAsDataURL(file);
            }))
        );
    }

    /**
     * Draw a single row of tiles to the buffer
     *
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Image[]} tiles 
     * @param {number} tileWidth 
     * @param {number} tileHeight 
     */
    function drawRow(ctx, tiles, tileWidth, tileHeight) {
        const img = tiles[Math.floor(Math.random() * tiles.length)];

        const x = tileWidth + MARGIN_PX;
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
     * Reset canvas context
     *
     * @param {HTMLCanvasElement} canvas 
     * @param {CanvasRenderingContext2D} ctx 
     */
    function clearCanvas(canvas, ctx) {
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document
        .getElementById('run')
        .addEventListener('click', () => {
            const tileWidth = 250;
            const tileHeight = 50;

            const rows = parseInt(rowsInput.value);
            const cols = parseInt(colsInput.value);

            canvas.width = parseInt(widthInput.value);
            canvas.height = parseInt(heightInput.value);

            canvasBuf.width = (tileWidth + MARGIN_PX) * cols;
            canvasBuf.height = tileHeight;

            loadImages(tiles.files).then((images) => {
                clearCanvas(canvas, ctx);

                for (let row = 0; row < rows; row++) {
                    clearCanvas(canvasBuf, ctxBuf);

                    for (let col = 0; col < cols; col++) {
                        drawRow(ctxBuf, images, tileWidth, tileHeight);
                    }

                    const offsetX = Math.floor(Math.random() * tileWidth);

                    ctx.save();
                    ctx.translate(offsetX, 0);
                    ctx.fillStyle = ctx.createPattern(canvasBuf, 'repeat-x');
                    ctx.fillRect(-1 * offsetX, 0, canvas.width, canvasBuf.height);
                    ctx.restore();

                    ctx.translate(0, tileHeight + MARGIN_PX);
                }

                document.body.appendChild(canvas);
            });
        });
    }
)();
