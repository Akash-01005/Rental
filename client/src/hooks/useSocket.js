import { useEffect, useCallback } from 'react';
import { socketService } from '../libs';
import { useAuthStore } from '../store';

export const useSocket = () => {
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            socketService.connect();
            socketService.joinUserBookings(user._id);

            return () => {
                socketService.disconnect();
            };
        }
    }, [user]);

    const joinPropertyRoom = useCallback((propertyId) => {
        socketService.joinPropertyRoom(propertyId);
    }, []);

    const onBookingUpdate = useCallback((callback) => {
        socketService.onBookingUpdate(callback);
    }, []);

    const onPropertyUpdate = useCallback((callback) => {
        socketService.onPropertyUpdate(callback);
    }, []);

    return {
        joinPropertyRoom,
        onBookingUpdate,
        onPropertyUpdate
    };
}; 