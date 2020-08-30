/**
 * Asynchronously read files and return a promise
 *
 * @param {string[]} files 
 */
export function loadImages(files) {
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
