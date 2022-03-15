import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { detectCanvas } from './utils';
import TokenController from './controller';


export const MintToken = () => {
    const editor = useRef<any>();
    const canvas = useRef<HTMLCanvasElement & any>();
    const container = useRef<Element & any>();
    const [file, setFile] = useState<File>();
    const [scale, setScale] = useState(1);
    const [imageData, setImageData] = useState<ImageData & any>();
    const size = 300;
    const threshold = 200;

    const onSelectFile = (e: EventTarget & any) => {
        setFile(e.target.files[0]);
    };

    const crop = () => {
        const editorCtx = editor.current.getImageScaledToCanvas().getContext('2d');
        const editorImageData = editorCtx.getImageData(0, 0, size, size);
        const ctx = canvas?.current?.getContext('2d');
        ctx.putImageData(editorImageData, 0, 0);
        setImageData(editorImageData);
    }

    const draw = (thr = threshold) => {
        canvas.current.width = imageData.width;
        canvas.current.height = imageData.width;
        const ctx = canvas?.current?.getContext('2d');
        const tmpImageData = ctx.getImageData(0, 0, imageData.width, imageData.height);
        tmpImageData.data.set(detectCanvas(
            {
                data: new Uint8ClampedArray(imageData.data),
                width: imageData.width,
                height: imageData.height
            },
            thr,
            1,
            true,
        ).data);
        ctx.putImageData(tmpImageData, 0, 0);
    };

    const set = () => {
        const ctx = canvas?.current?.getContext('2d');
        const ctxImageData = ctx.getImageData(0, 0, imageData.width, imageData.height);
        setImageData(ctxImageData);
        new TokenController(container.current, ctxImageData);
    };

    return (<div>
        <div className="btn">Image<input type="file" className="file" accept="image/*" onChange={onSelectFile} /></div>
        {file && <div>
            <div>
                <AvatarEditor
                    image={file}
                    ref={editor}
                    scale={scale}
                    rotate={0}
                    width={size}
                    height={size}
                    color={[255, 255, 255, 0.6]}
                />
            </div>
            <div>
                <input
                    name="scale"
                    type="range"
                    onChange={(e) => setScale(+e.target.value)}
                    min="0.1"
                    max="2"
                    step="0.01"
                    defaultValue="1"
                />
            </div>
        </div>}
        <div>
            <button onClick={crop}>Crop</button>
            <button onClick={() => draw(threshold)}>Draw</button>
            <button onClick={set}>Set</button>
        </div>
        {imageData && <input
            name="threshold"
            type="range"
            onChange={(e) => draw(+e.target.value)}
            min="1"
            max="250"
            step="1"
            defaultValue={threshold}
        />}
        <canvas ref={canvas} width={size} height={size} />
        <div ref={container} style={{ height: '500px' }} />
    </div >);
};
