import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  location: {
    address: {
      type: String,
      required: [true, "Address is required"]
    },
    city: {
      type: String,
      required: [true, "City is required"]
    },
    state: {
      type: String,
      required: [true, "State is required"]
    },
    country: {
      type: String,
      required: [true, "Country is required"]
    },
    zipCode: String
  },
  images: {
    type: [String],
    required: [true, "At least one image is required"],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "At least one image is required"
    }
  },
  amenities: [{
    type: String
  }],
  specifications: {
    bedrooms: {
      type: Number,
      required: true,
      min: [1, "Number of bedrooms must be at least 1"]
    },
    bathrooms: {
      type: Number,
      required: true,
      min: [1, "Number of bathrooms must be at least 1"]
    },
    area: {
      type: Number,
      required: true,
      min: [1, "Area must be greater than 0"]
    },
    furnished: {
      type: Boolean,
      default: false
    }
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
    enum: ['vegetarian', 'non-vegetarian', 'both'],
    required: true
  },
  religionPreference: {
    type: String,
    required: true
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

// Add indexes for better query performance
propertySchema.index({ status: 1, "location.city": 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ foodPreference: 1 });
propertySchema.index({ owner: 1 });

const propertyModel = mongoose.model('Property', propertySchema);

export default propertyModel;