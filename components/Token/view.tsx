import { useEffect, useRef, CSSProperties, RefObject } from 'react';
import { TokenController } from './controller';
import { dataUrlToImageData } from './utils';

interface TokenProps {
  dataUrl: string;
  style?: CSSProperties;
  ctrl?: RefObject<TokenController> | any;
}

export const Token = ({ dataUrl, style, ctrl }: TokenProps) => {
  const container = useRef<HTMLDivElement & any>();

  useEffect(() => {
    if (dataUrl) {
      let controller: TokenController;
      dataUrlToImageData(dataUrl).then((imageData) => {
        controller = new TokenController({
          container: container.current,
          imageData: imageData as ImageData,
        });
        if (ctrl) {
          ctrl.current = controller;
        }
      });
      return () => controller?.destroy();
    }
  }, [dataUrl, ctrl]);

  return <div ref={container} style={style} />;
};
