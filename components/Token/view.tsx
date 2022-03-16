import { useEffect, useRef, CSSProperties } from 'react';
import { TokenController } from './controller';
import { dataUrlToImageData } from './utils';

interface TokenProps {
    dataUrl: string;
    style?: CSSProperties;
}

export const Token = ({ dataUrl, style }: TokenProps) => {
    const container = useRef<HTMLDivElement & any>();

    useEffect(() => {
        dataUrlToImageData(dataUrl).then((imageData) => new TokenController(container.current, imageData as ImageData));
    }, []);

    return (
        <div ref={container} style={style} />
    );
};