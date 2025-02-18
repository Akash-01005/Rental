import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Join room for specific property
        socket.on('join_property', (propertyId) => {
            socket.join(`property_${propertyId}`);
        });

        // Join room for user's bookings
        socket.on('join_user_bookings', (userId) => {
            socket.join(`user_${userId}`);
        });

        // Handle booking events
        socket.on('new_booking', (booking) => {
            // Notify property room about new booking
            io.to(`property_${booking.property}`).emit('booking_update', {
                type: 'new',
                booking
            });
        });

        socket.on('booking_status_change', ({ bookingId, propertyId, status }) => {
            // Notify property room about booking status change
            io.to(`property_${propertyId}`).emit('booking_update', {
                type: 'status_change',
                bookingId,
                status
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Utility functions for emitting events
export const emitBookingCreated = (booking) => {
    if (!io) return;

    // Notify property room
    io.to(`property_${booking.property}`).emit('booking_update', {
        type: 'new',
        booking
    });

    // Notify user room
    io.to(`user_${booking.user}`).emit('booking_update', {
        type: 'new',
        booking
    });
};

export const emitBookingStatusChanged = (booking) => {
    if (!io) return;

    // Notify property room
    io.to(`property_${booking.property}`).emit('booking_update', {
        type: 'status_change',
        booking
    });

    // Notify user room
    io.to(`user_${booking.user}`).emit('booking_update', {
        type: 'status_change',
        booking
    });
};

export const emitPropertyAvailabilityChanged = (propertyId, isAvailable) => {
    if (!io) return;

    io.to(`property_${propertyId}`).emit('property_update', {
        type: 'availability_change',
        isAvailable
    });
}; 
