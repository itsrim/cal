import React from "react";
import styled from "styled-components";
import {
  BrowserMultiFormatReader,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException,
} from "@zxing/library";

const Backdrop = styled.div<{ $isDarkMode: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: ${(p) => (p.$isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)")};
  display: grid;
  place-items: center;
  transition: background-color 0.3s ease;
`;
const Sheet = styled.div<{ $isDarkMode: boolean }>`
  width: min(640px, 92vw);
  background: ${(p) => (p.$isDarkMode ? "#0b0b0f" : "#ffffff")};
  border: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  border-radius: 16px;
  padding: 16px;
  display: grid;
  gap: 12px;
  transition: all 0.3s ease;
`;
const VideoBox = styled.div<{ $isDarkMode: boolean }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/10;
  background: ${(p) => (p.$isDarkMode ? "#13131a" : "#f9fafb")};
  border: 1px solid ${(p) => (p.$isDarkMode ? "#262631" : "#e5e7eb")};
  transition: all 0.3s ease;
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
const Ghost = styled(Btn)<{ $isDarkMode: boolean }>`
  background: ${(p) => (p.$isDarkMode ? "#1a1a22" : "#f3f4f6")};
  color: ${(p) => (p.$isDarkMode ? "#e6e6eb" : "#1a1a1f")};
  transition: all 0.3s ease;
`;

type BarCodeScannerProps = {
  onClose: () => void;
  onDetected: (ean: string) => void;
  isDarkMode: boolean;
};

export const BarCodeScanner = ({
  onClose,
  onDetected,
  isDarkMode,
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
    <Backdrop $isDarkMode={isDarkMode} role="dialog" aria-modal="true" aria-label="Scanner code-barres">
      <Sheet $isDarkMode={isDarkMode}>
        <VideoBox $isDarkMode={isDarkMode}>
          <Video ref={videoRef} playsInline muted />
        </VideoBox>
        {error ? <div style={{ color: "#f87171" }}>{error}</div> : null}
        <Controls>
          <Ghost $isDarkMode={isDarkMode} onClick={onClose}>Fermer</Ghost>
        </Controls>
      </Sheet>
    </Backdrop>
  );
};
