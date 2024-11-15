import React, { useRef, useEffect } from 'react';
import { QrCode, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 border-2 border-blue-500 opacity-50" />
      </div>
      <div className="text-center text-sm text-gray-600">
        <p className="flex items-center justify-center">
          <QrCode className="h-5 w-5 mr-2" />
          Position the QR code within the frame
        </p>
      </div>
    </div>
  );
}