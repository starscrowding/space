export const detectCanvas = (imageData: ImageData, threshold: number, radius: number, mode: boolean) => {
    const data = imageData.data;
    const length = imageData.width;

    for (let i = 0; i < length ** 2; i += 1) {
        const x = (i % length);
        const y = ((i - x) / length);

        if (((x - (length / 2)) ** 2) + ((y - (length / 2)) ** 2) <= ((length / 2) * radius) ** 2) {
            const r = data[i * 4];
            const g = data[(i * 4) + 1];
            const b = data[(i * 4) + 2];

            if (Math.max(r, g, b) < threshold) {
                data[i * 4] = mode ? 0 : 255;
                data[(i * 4) + 1] = 0;
                data[(i * 4) + 2] = 0;
            } else if (mode) {
                data[i * 4] = 255;
                data[(i * 4) + 1] = 255;
                data[(i * 4) + 2] = 255;
            }
        } else data[(i * 4) + 3] = mode ? 0 : 100;
    }

    return imageData;
};

export function formatImageData(imageData: ImageData) {
    const data = new Uint8Array(imageData.data.buffer);
    for (let i = 0; i < imageData.width ** 2; i += 1) {
        if (data[(i * 4) + 3] === 255) data[(i * 4) + 3] = data[i * 4] === 0 ? 120 : 0;
    }
    return data;
}

export const dataUrlToImageData = (dataUrl: string) => {
    return new Promise(function (resolve, reject) {
        if (dataUrl == null) return reject();
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            image = new Image();
        image.addEventListener('load', function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(ctx?.getImageData(0, 0, canvas.width, canvas.height));
        }, false);
        image.src = dataUrl;
    });
}

export const metaToBlob = (meta: any) => {
    const str = JSON.stringify(meta);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
        type: 'application/json;charset=utf-8'
    });
    return blob;
};
