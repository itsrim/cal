import React from "react";
import styled from "styled-components";
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException,
} from "@zxing/library";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
`;
const Sheet = styled.div`
  width: min(640px, 92vw);
  background: #0b0b0f;
  border: 1px solid #262631;
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
`;
const VideoBox = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
  background: #13131a;
  border: 1px solid #262631;
`;
const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Controls = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
const Btn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 0;
  background: #4f46e5;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
`;
const Ghost = styled(Btn)`
  background: #1a1a22;
`;

type BarCodeScannerProps = {
  onClose: () => void;
  onDetected: (ean: string) => void;
};

export const BarCodeScanner = ({
  onClose,
  onDetected,
}: BarCodeScannerProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const readerRef = React.useRef<BrowserMultiFormatReader | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);

    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    // démarrage caméra (priorité au capteur arrière)
    reader
      .listVideoInputDevices()
      .then((devices) => {
        const back = devices.find((d) =>
          /back|rear|environment/i.test(d.label)
        );
        return reader.decodeFromVideoDevice(
          back?.deviceId ?? undefined,
          videoRef.current!,
          (result, err) => {
            if (result) {
              const text = result.getText().trim();
              if (/^\d{8,14}$/.test(text)) {
                stop();
                onDetected(text);
              }
            } else if (err && !(err instanceof NotFoundException)) {
              // erreurs non fatales ignorées
            }
          }
        );
      })
      .catch((e) => setError("Accès caméra impossible."));

    const stop = () => {
      try {
        reader.reset();
      } catch {}
      try {
        const s = videoRef.current?.srcObject as MediaStream | undefined;
        s?.getTracks().forEach((t) => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      } catch {}
    };

    return () => stop();
  }, [onDetected]);

  return (
    <Backdrop role="dialog" aria-modal="true" aria-label="Scanner code-barres">
      <Sheet>
        <VideoBox>
          <Video ref={videoRef} playsInline muted />
        </VideoBox>
        {error ? <div style={{ color: "#f87171" }}>{error}</div> : null}
        <Controls>
          <Ghost onClick={onClose}>Fermer</Ghost>
        </Controls>
      </Sheet>
    </Backdrop>
  );
};
