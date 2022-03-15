
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