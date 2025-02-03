import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { 
    Camera, 
    StopCircle, 
    RefreshCcw, 
    CheckCircle, 
    VideoIcon, 
    XCircle 
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
        width: 640,
        height: 480,
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
        <div className="space-y-4">
            <div className="camView">
                {isShowVideo && !capturedImage ? (
                    <Webcam 
                        audio={false} 
                        ref={webcamRef} 
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints} 
                        className="w-full rounded-lg"
                    />
                ) : capturedImage ? (
                    <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full rounded-lg" 
                    />
                ) : null}
            </div>

            <div className="flex justify-center gap-4">
                {!isShowVideo && !capturedImage && (
                    <button 
                        onClick={startCam}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2"
                    >
                        <VideoIcon className="w-5 h-5" />
                        Start Camera
                    </button>
                )}

                {isShowVideo && !capturedImage && (
                    <>
                        <button 
                            onClick={captureImage}
                            className="w-1/2 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Capture Photo
                        </button>
                        <button 
                            onClick={stopCam}
                            className="w-1/2 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
                        >
                            <StopCircle className="w-5 h-5" />
                            Stop Camera
                        </button>
                    </>
                )}

                {capturedImage && (
                    <>
                        <button 
                            onClick={resetCapture}
                            className="w-1/2 py-2 bg-gray-500 text-white rounded-lg flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Recapture
                        </button>
                        <button 
                            onClick={submitImage}
                            disabled={!capturedBlob}
                            className="w-1/2 py-2 bg-blue-600 text-white rounded-lg 
                                       disabled:bg-blue-300 flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Submit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FaceCapture;