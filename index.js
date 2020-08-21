(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const canvasBuf = document.createElement('canvas');
    const ctxBuf = canvasBuf.getContext('2d');

    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');

    const rowsInput = document.getElementById('rows');
    const colsInput = document.getElementById('cols');

    const tiles = document.getElementById('tiles');

    const offsetInput = document.getElementById('offset');
    const marginInput = document.getElementById('margin');

    const offsetPatterns = [randOffset, constOffset];

    /**
     * Asynchronously read files and return a promise
     *
     * @param {string[]} files 
     */
    function loadImages(files) {
        return Promise.all(
            [...files].map((file) => new Promise(
                (resolve, reject) => {
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
                }
            ))
        );
    }

    /**
     * Draw a single row of tiles to the buffer
     *
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Image[]} tiles 
     * @param {number} tileWidth 
     * @param {number} tileHeight
     * @param {number} margin
     */
    function drawRow(ctx, tiles, tileWidth, tileHeight, margin) {
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
     * Randomized offset pattern generator
     *
     * @param {number} row 
     * @param {number} tileWidth 
     */
    function randOffset(row, tileWidth) {
        return Math.floor(Math.random() * tileWidth);
    }

    /**
     * Constant offset pattern generator
     *
     * @param {number} row 
     * @param {number} tileWidth 
     */
    function constOffset(row, tileWidth) {
        return 0;
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
            loadImages(tiles.files).then((images) => {
                const width = parseInt(widthInput.value);
                const height = parseInt(heightInput.value);
                const rows = parseInt(rowsInput.value);
                const cols = parseInt(colsInput.value);
                const margin = parseInt(marginInput.value);
                const makeOffset = offsetPatterns[parseInt(offsetInput.value)];

                const tileWidth = (width - (margin * cols)) / cols;
                const tileHeight = Math.round((height - (margin * rows)) / rows, 2);

                canvas.width = width;
                canvas.height = height;
                canvasBuf.width = (tileWidth + margin) * cols;
                canvasBuf.height = tileHeight;

                clearCanvas(canvas, ctx);
                ctx.fillStyle = 'grey';
                ctx.fillRect(0, 0, width, height);

                for (let row = 0; row < rows; row++) {
                    clearCanvas(canvasBuf, ctxBuf);

                    for (let col = 0; col < cols; col++) {
                        drawRow(ctxBuf, images, tileWidth, tileHeight, margin);
                    }

                    const offsetX = makeOffset(row, tileWidth);

                    ctx.save();
                    ctx.translate(offsetX, 0);
                    ctx.fillStyle = ctx.createPattern(canvasBuf, 'repeat-x');
                    ctx.fillRect(-1 * offsetX, 0, canvas.width, canvasBuf.height);
                    ctx.restore();

                    ctx.translate(0, tileHeight + margin);
                }

                document.body.appendChild(canvas);
            });
        });
    }
)();
