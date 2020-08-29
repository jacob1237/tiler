(function () {
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

    /**
     * Memoize arbitrary function
     *
     * @param {Function} func
     * @param {string} separator Custom cache hashmap key separator for function arguments
     */
    function memoize(func, separator = ':') {
        const cache = {};

        return function() {
            const key = [...arguments].join(separator);

            if (typeof cache[key] === 'undefined') {
                cache[key] = func(...arguments);
            }

            return cache[key];
        };
    }

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
                        img.onload = () => resolve(img);
                        img.src = e.target.result;
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
     * Reset canvas context
     *
     * @param {CanvasRenderingContext2D} ctx 
     */
    function clearCanvas(ctx) {
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

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
    function drawTexture(ctx, width, height, cols, rows, margin, tiles, offsetFunc) {
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
    }
)();
