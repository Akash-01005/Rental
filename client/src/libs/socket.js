import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.SOCKET_URL;

class SocketService {
    socket = null;

    connect() {
        this.socket = io(SOCKET_URL, {
            withCredentials: true
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return this.socket;
    }

    joinPropertyRoom(propertyId) {
        if (!this.socket) return;
        this.socket.emit('join_property', propertyId);
    }

    joinUserBookings(userId) {
        if (!this.socket) return;
        this.socket.emit('join_user_bookings', userId);
    }

    onBookingUpdate(callback) {
        if (!this.socket) return;
        this.socket.on('booking_update', callback);
    }

    onPropertyUpdate(callback) {
        if (!this.socket) return;
        this.socket.on('property_update', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService(); 