import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for handling media stream cleanup on route changes and tab visibility changes
 * @param {React.MutableRefObject} mediaStreamRef - Reference to the media stream
 * @param {string} componentName - Name for logging purposes
 */
export const useMediaCleanup = (mediaStreamRef, componentName = 'Component') => {
    const location = useLocation();

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!mediaStreamRef.current) return;

            if (document.hidden) {
                console.log(`[${componentName}] Tab hidden - pausing camera`);
                mediaStreamRef.current.getVideoTracks().forEach(track => {
                    track.enabled = false;
                });
            } else {
                console.log(`[${componentName}] Tab visible - resuming camera`);
                mediaStreamRef.current.getVideoTracks().forEach(track => {
                    track.enabled = true;
                });
            }
        };

        const handleBeforeUnload = () => {
            console.log(`[${componentName}] Page unloading - cleaning up media`);
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };

        const handlePageHide = () => {
            console.log(`[${componentName}] Page hidden - stopping camera`);
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };

        // Add event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [mediaStreamRef, componentName]);

    // Handle route changes
    useEffect(() => {
        return () => {
            console.log(`[${componentName}] Route changing - cleaning up media stream`);
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => {
                    console.log(`[${componentName}] Stopping track: ${track.kind}`);
                    track.stop();
                });
                mediaStreamRef.current = null;
            }
        };
    }, [location.pathname, mediaStreamRef, componentName]);
};

export default useMediaCleanup;