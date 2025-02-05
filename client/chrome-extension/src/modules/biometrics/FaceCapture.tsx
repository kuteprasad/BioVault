import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { 
    Camera, 
    StopCircle, 
    RefreshCcw, 
    CheckCircle, 
    VideoIcon
} from 'lucide-react';

interface FaceCaptureProps {
    onCapture: (blob: Blob) => void;
    onError: (error: string) => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onCapture, onError }) => {
    const [isShowVideo, setIsShowVideo] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const webcamRef = useRef<Webcam>(null);
    
    const videoConstraints = {
        width: 280,
        height: 210, // 4:3 aspect ratio for popup
        facingMode: "user"
    };

    const startCam = () => {
        setIsShowVideo(true);
    };

    const stopCam = () => {
        try {
            if (webcamRef.current && webcamRef.current.stream) {
                const stream = webcamRef.current.stream;
                const tracks = stream.getTracks();
                tracks.forEach((track: MediaStreamTrack) => track.stop());
                setIsShowVideo(false);
            }
        } catch (error) {
            onError('Failed to stop camera');
        }
    };

    const captureImage = () => {
        try {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    setCapturedImage(imageSrc);

                    fetch(imageSrc)
                        .then(res => res.blob())
                        .then(blob => {
                            setCapturedBlob(blob);
                        })
                        .catch(error => {
                            console.log('Error:', error);
                            onError('Failed to process captured image');
                        });
                }
            }
        } catch (error) {
            onError('Failed to capture image');
        }
    };

    const submitImage = () => {
        if (capturedBlob) {
            onCapture(capturedBlob);
        }
    };

    const resetCapture = () => {
        setCapturedImage(null);
        setCapturedBlob(null);
    };

    return (
        <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                {isShowVideo && !capturedImage ? (
                    <Webcam 
                        audio={false} 
                        ref={webcamRef} 
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints} 
                        className="w-full h-full object-cover"
                    />
                ) : capturedImage ? (
                    <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-2">
                {!isShowVideo && !capturedImage && (
                    <button 
                        onClick={startCam}
                        className="w-full flex items-center justify-center gap-2 py-2 
                          bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                          transition-colors text-sm"
                    >
                        <VideoIcon className="w-4 h-4" />
                        Start Camera
                    </button>
                )}

                {isShowVideo && !capturedImage && (
                    <>
                        <button 
                            onClick={captureImage}
                            className="flex-1 flex items-center justify-center gap-2 py-2 
                              bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                              transition-colors text-sm"
                        >
                            <Camera className="w-4 h-4" />
                            Capture
                        </button>
                        <button 
                            onClick={stopCam}
                            className="flex-1 flex items-center justify-center gap-2 py-2 
                              bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                              transition-colors text-sm"
                        >
                            <StopCircle className="w-4 h-4" />
                            Stop
                        </button>
                    </>
                )}

                {capturedImage && (
                    <>
                        <button 
                            onClick={resetCapture}
                            className="flex-1 flex items-center justify-center gap-2 py-2 
                              bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                              transition-colors text-sm"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button 
                            onClick={submitImage}
                            disabled={!capturedBlob}
                            className="flex-1 flex items-center justify-center gap-2 py-2 
                              bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                              disabled:bg-purple-400 transition-colors text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Submit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FaceCapture;