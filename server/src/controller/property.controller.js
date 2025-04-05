import propertyModel from '../models/property.js';

export const getAllProperties = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, minPrice, maxPrice, city, bedrooms, foodPreference, religionPreference, petsAllowed } = req.query;
        const query = {};
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

        const total = await propertyModel.countDocuments(query);

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

