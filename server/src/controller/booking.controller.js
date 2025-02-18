import bookingModel from '../models/booking.js';
import propertyModel from '../models/property.js';
import { emitBookingCreated, emitBookingStatusChanged } from '../libs/socket.js';

export const createBooking = async (req, res) => {
    try {
        const { 
            property, moveInDate, leaseDuration, monthlyRent, 
            securityDeposit, tenantDetails, specialRequests, 
            contactNumber, utilityIncluded 
        } = req.body;

        if (!property || !moveInDate || !leaseDuration || !monthlyRent || 
            !securityDeposit || !contactNumber) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const booking = await bookingModel.create({ 
            property,
            tenant: req.user._id,
            moveInDate: new Date(moveInDate),
            leaseDuration,
            monthlyRent,
            securityDeposit,
            tenantDetails,
            utilityIncluded,
            specialRequests,
            contactNumber
        });

        // Emit socket event for real-time updates
        emitBookingCreated(booking);

        return res.status(201).json({ booking, message: "Booking created successfully" });
    } catch (error) {
        console.error('Create booking error:', error);
        return res.status(500).json({ message: error?.message || "Error creating booking" });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { tenant: req.user._id };
        if (status) query.status = status;

        const bookings = await bookingModel.find(query)
            .populate('property')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await bookingModel.countDocuments(query);

        return res.status(200).json({ bookings, totalPages: Math.ceil(total / limit), currentPage: Number(page), total, message: "Rental applications fetched successfully" });
    } catch (error) {
        return res.status(500).json({ message: error?.message || "Error fetching rental applications" });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.findById(id)
            .populate('property')
            .populate('tenant', 'name email');

        if (!booking) {
            return res.status(404).json({ message: "Rental application not found" });
        }

        if (booking.tenant._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this rental application" });
        }

        return res.status(200).json({ booking, message: "Rental application fetched successfully" });
    } catch (error) {
        return res.status(500).json({ message: error?.message || "Error fetching rental application" });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected', 'active', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await bookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Rental application not found" });
        }

        if (booking.tenant.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this rental application" });
        }

        booking.status = status;
        await booking.save();

        emitBookingStatusChanged(booking);

        return res.status(200).json({ booking, message: "Rental application status updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error?.message || "Error updating rental application status" });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Rental application not found" });
        }

        if (booking.tenant.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this rental application" });
        }

        await bookingModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Rental application deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error?.message || "Error deleting rental application" });
    }
};
