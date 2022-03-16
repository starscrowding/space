import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { detectCanvas } from './utils';
import { Token } from './view';

export const MintToken = () => {
    const [step, setStep] = useState('start');
    const editor = useRef<any>();
    const canvas = useRef<HTMLCanvasElement & any>();
    const [file, setFile] = useState<File>();
    const [scale, setScale] = useState(1);
    const [imageData, setImageData] = useState<ImageData | undefined>();
    const [dataUrl, setDataUrl] = useState<string | undefined>();
    const size = 300;
    const threshold = 200;

    const onSelectFile = (e: EventTarget & any) => {
        setFile(e.target.files[0]);
        setStep('crop');
    };

    const crop = () => {
        const editorCtx = editor.current.getImageScaledToCanvas().getContext('2d');
        const editorImageData = editorCtx.getImageData(0, 0, size, size);
        const ctx = canvas?.current?.getContext('2d');
        ctx.putImageData(editorImageData, 0, 0);
        setImageData(editorImageData);
        setStep('draw');
    }

    const draw = (thr = threshold) => {
        if (imageData) {
            canvas.current.width = imageData?.width;
            canvas.current.height = imageData?.width;
            const ctx = canvas?.current?.getContext('2d');
            const tmpImageData = ctx.getImageData(0, 0, imageData?.width, imageData?.height);
            tmpImageData.data.set(detectCanvas(
                {
                    data: new Uint8ClampedArray(imageData?.data),
                    width: imageData?.width,
                    height: imageData?.height
                },
                thr,
                1,
                true,
            ).data);
            ctx.putImageData(tmpImageData, 0, 0);
            setStep('preview');
        }
    };

    const set = () => {
        setDataUrl(canvas?.current?.toDataURL());
        setStep('view');
    };

    return (<div>
        <div>
            <button onClick={() => setStep('start')}>Start</button>
            <button onClick={crop}>Crop</button>
            <button onClick={() => draw(threshold)}>Draw</button>
            <button onClick={set}>Set</button>
        </div>
        <canvas ref={canvas} width={size} height={size} style={{ display: step === 'draw' || step === 'preview' ? 'block' : 'none' }} />
        {step === 'start' && <>
            <div className="btn">Image<input type="file" className="file" accept="image/*" onChange={onSelectFile} /></div>
        </>}
        {step === 'crop' && file && <div>
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
        {step === 'preview' && imageData && <div>
            <input
                name="threshold"
                type="range"
                onChange={(e) => draw(+e.target.value)}
                min="1"
                max="250"
                step="1"
                defaultValue={threshold}
            /></div>}
        {step === 'view' && dataUrl && <Token dataUrl={dataUrl} style={{ height: '500px' }} />}
    </div>);
};
