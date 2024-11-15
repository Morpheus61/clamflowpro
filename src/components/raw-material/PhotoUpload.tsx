import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  value: string | null;
  onPhotoCapture: (photoData: string) => void;
}

export default function PhotoUpload({ value, onPhotoCapture }: PhotoUploadProps) {
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsUsingCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or try uploading a photo instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsUsingCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.8); // Compress to 80% quality
        onPhotoCapture(photoData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          onPhotoCapture(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Weight measurement"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => onPhotoCapture('')}
            className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : isUsingCamera ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-48 object-cover rounded-lg"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={startCamera}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
          >
            <Camera className="h-5 w-5" />
            <span>Take Photo</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Photo</span>
          </button>
        </div>
      )}
    </div>
  );
}