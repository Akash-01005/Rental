import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  images: [{
    type: String,
    required: true
  }],
  amenities: [{
    type: String
  }],
  specifications: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    furnished: Boolean
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  ownerDetails: {
    name: String,
    phone: String,
    email: String,
    availableTime: {
      from: String,
      to: String
    }
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  },
  petsAllowed: {
    type: Boolean,
    default: false
  },
  foodPreference: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian'],
    default: 'non-vegetarian' 
  },
  religionPreference: {
    type: String,
    enum: ['hindu', 'muslim', 'christian', 'any-religion'],
    default: 'any-religion'
  },
  rules: [{
    type: String,
    trim: true
  }],
  parking: {
    bikeParking: {
      available: {
        type: Boolean,
        default: false
      },
      covered: {
        type: Boolean,
        default: false
      },
      charges: {
        type: Number,
        default: 0
      }
    },
    carParking: {
      available: {
        type: Boolean,
        default: false
      },
      covered: {
        type: Boolean,
        default: false
      },
      charges: {
        type: Number,
        default: 0
      }
    }
  },
  tenantType:{
    type: String,
    enum: ['bachelors-only', 'family-only', 'any-tenant'],
    default: 'any-tenant' 
  }
}, { timestamps: true });

const propertyModel = mongoose.model('Property', propertySchema);

export default propertyModel;