import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const MediaPermissions: React.FC = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [error, setError] = useState<string>('');

  const checkPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ 
        name: 'camera' as PermissionName 
      });
      
      setHasPermissions(result.state === 'granted');
    } catch (err) {
      setError('Failed to check permissions');
      console.error(err);
    }
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermissions(true);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
            setError('Permission denied. Please enable camera/microphone access in your browser settings.');
            break;
          case 'NotFoundError':
            setError('Camera or microphone not found.');
            break;
          default:
            setError(`Error accessing media devices: ${err.message}`);
        }
      }
      console.error(err);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <div className="p-4">
      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={requestPermissions}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={hasPermissions}
      >
        {hasPermissions ? 'Permissions Granted' : 'Request Camera & Mic Access'}
      </button>
      
      {hasPermissions && (
        <p className="mt-2 text-green-600">
          Camera and microphone access granted!
        </p>
      )}
    </div>
  );
};

export default MediaPermissions;