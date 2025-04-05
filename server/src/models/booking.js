import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, "Property is required"]
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: [true, "Tenant is required"]
  },
  moveInDate: {
    type: Date,
    required: [true, "Move-in date is required"]
  },
  leaseDuration: {
    type: Number,
    required: [true, "Lease duration is required"],
    min: [1, "Minimum lease duration is 1 month"]
  },
  monthlyRent: {
    type: Number,
    required: [true, "Monthly rent is required"],
    min: [0, "Rent cannot be negative"]
  },
  securityDeposit: {
    type: Number,
    required: [true, "Security deposit is required"]
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'cancelled', 'active', 'completed'],
      message: "Invalid booking status"
    },
    default: 'pending'
  },
  tenantDetails: {
    occupation: String,
    workplace: String,
    familySize: Number,
    idProof: String,
    alternateMobile: String
  },
  agreementDetails: {
    startDate: Date,
    endDate: Date,
    isRegistered: {
      type: Boolean,
      default: false
    },
    registrationNumber: String
  },
  utilityIncluded: {
    electricity: {
      type: Boolean,
      default: false
    },
    water: {
      type: Boolean,
      default: false
    },
    maintenance: {
      type: Boolean,
      default: false
    }
  },
  specialRequests: {
    type: String,
    trim: true,
    maxLength: [500, "Special requests cannot exceed 500 characters"]
  },
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

bookingSchema.index({ property: 1, status: 1 });
bookingSchema.index({ tenant: 1, status: 1 });

bookingSchema.pre('save', function(next) {
  if (this.moveInDate < new Date()) {
    next(new Error('Move-in date cannot be in the past'));
  }
  next();
});

bookingSchema.index({ user: 1, status: 1 });

bookingSchema.pre('save', function(next) {
  if (this.checkIn >= this.checkOut) {
    next(new Error('Check-out date must be after check-in date'));
  }
  if (this.checkIn < new Date()) {
    next(new Error('Check-in date cannot be in the past'));
  }
  next();
});

bookingSchema.statics.checkAvailability = async function(propertyId, checkIn, checkOut) {
  const overlappingBookings = await this.find({ property: propertyId,status: { $nin: ['cancelled'] },$or: [{ checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }]});
  return overlappingBookings.length === 0;
};

const bookingModel = mongoose.model('Booking', bookingSchema); 

export default bookingModel;