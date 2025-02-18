import propertyModel from '../models/property.js';

export const createProperty = async (req, res) => {
    try {
        // Check if propertyData exists in request body
        if (!req.body.propertyData) {
            return res.status(400).json({ 
                status: false,
                message: "Property data is required" 
            });
        }

        let propertyData;
        try {
            propertyData = JSON.parse(req.body.propertyData);
        } catch (error) {
            return res.status(400).json({ 
                status: false,
                message: "Invalid property data format" 
            });
        }

        // Update image URLs to use the client-side path
        const imageUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];
        
        // Create property with image URLs
        const property = await propertyModel.create({
            ...propertyData,
            images: imageUrls,
            owner: req.user._id // Set from authenticated user
        });

        // Populate owner details
        await property.populate('owner');

        return res.status(201).json({
            status: true,
            message: "Property created successfully",
            property
        });

    } catch (error) {
        console.error('Create property error:', error);
        return res.status(500).json({
            status: false,
            message: error.message || "Failed to create property"
        });
    }
};

export const getAllProperties = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, minPrice, maxPrice, city, bedrooms, foodPreference, religionPreference, petsAllowed } = req.query;

        const query = {};

        // Add filters
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (city) query['location.city'] = { $regex: city, $options: 'i' };
        if (bedrooms) query['specifications.bedrooms'] = Number(bedrooms);
        if (foodPreference) query.foodPreference = foodPreference;
        if (religionPreference) query.religionPreference = religionPreference;
        if (petsAllowed !== undefined) query.petsAllowed = petsAllowed === 'true';

        // Get total count for pagination
        const total = await propertyModel.countDocuments(query);

        // Get paginated results
        const properties = await propertyModel.find(query)
            .populate('owner', 'name email phone')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            properties,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            total
        });
    } catch (error) {
        console.error('Get all properties error:', error);
        return res.status(500).json({
            status: false,
            message: error.message || "Error fetching properties"
        });
    }
};

export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await propertyModel.findById(id)
            .populate('owner', 'name email phone');

        if (!property) {
            return res.status(404).json({
                status: false,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: true,
            property
        });
    } catch (error) {
        console.error('Get property by id error:', error);
        return res.status(500).json({
            status: false,
            message: error.message || "Error fetching property"
        });
    }
};

export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const property = await propertyModel.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (property.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this property" });
        }

        if (req.files?.length) {
            updates.images = [...property.images, ...req.files.map(file => file.path)];
        }

        const updatedProperty = await propertyModel.findByIdAndUpdate(id, updates, { new: true });

        return res.status(200).json({ property: updatedProperty, message: "Property updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error?.message || "Error updating property" });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await propertyModel.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (property.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this property" });
        }

        await propertyModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error?.message || "Error deleting property" });
    }
};
