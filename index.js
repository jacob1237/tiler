(function ()
{
    const MARGIN_PX = 2;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");

    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const tiles = document.getElementById('tiles');

    /**
     * Asynchronously read files and return promise
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

    document
        .getElementById('run')
        .addEventListener('click', () => {
            canvas.setAttribute('width', widthInput.value);
            canvas.setAttribute('height', heightInput.value);

            loadImages(tiles.files).then((images) => {
                const w = 250, h = 50;

                ctx.setTransform(1,0,0,1,0,0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let j = 0; j < 6; j++) {
                    ctx.save();

                    for (let i = 0; i < 3; i++) {
                        const img = images[Math.floor(Math.random() * images.length)];
    
                        const x = w + MARGIN_PX;
                        const cx = w / 2, cy = h / 2;
    
                        ctx.save();
    
                        ctx.translate(cx, cy);
                        ctx.rotate((Math.PI / 180) * Math.round(Math.random()) * 180);
                        ctx.scale(1, Math.random() < 0.5 ? -1 : 1);
                        ctx.translate(-cx, -cy);
    
                        ctx.drawImage(img, 0, 0, w, h);
                        ctx.restore();

                        ctx.translate(x, 0);
                    }

                    ctx.restore();
                    ctx.translate(0, h + MARGIN_PX);
                }

                document.body.appendChild(canvas);
            });
        });
    }
)();
 