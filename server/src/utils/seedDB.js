import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dummyUsers, dummyProperties, dummyBookings } from './dummyData.js';
import userModel from '../models/user.js';
import propertyModel from '../models/property.js';
import bookingModel from '../models/booking.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');

        await userModel.deleteMany({});
        await propertyModel.deleteMany({});
        await bookingModel.deleteMany({});
        console.log('Cleared existing data');

        const hashedUsers = await Promise.all(
            dummyUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10)
            }))
        );
        const createdUsers = await userModel.create(hashedUsers);
        console.log('Users created');

        const propertiesWithOwners = dummyProperties.map(property => ({
            ...property,
            owner: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id
        }));
        const createdProperties = await propertyModel.create(propertiesWithOwners);
        console.log('Properties created');

        const bookingsWithRefs = dummyBookings.map(booking => ({
            ...booking,
            user: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
            property: createdProperties[Math.floor(Math.random() * createdProperties.length)]._id
        }));
        await bookingModel.create(bookingsWithRefs);
        console.log('Bookings created');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Call the function directly
seedDatabase();