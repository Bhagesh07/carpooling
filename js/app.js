const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portab_db')
    .then(() => {
        console.log('Connected to MongoDB: portab_db');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'driver'], required: true }
});

// Create User Model
const User = mongoose.model('user', userSchema);

// Handle Login/Signup
app.post('/auth', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({ username });

        if (user) {
            // Login Logic
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return res.json({ success: true, role: user.role });
            } else {
                return res.json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            // Signup Logic
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ username, password: hashedPassword, role });
            await user.save();
            return res.json({ success: true, message: 'User registered successfully!' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.json({ success: false, message: 'An error occurred' });
    }
});

// Fetch All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Add a New User
app.post('/api/users', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
});

// Update a User by ID
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    try {
        let updateData = { username, role };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete a User by ID
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Google Maps API Route (sending latitude/longitude data for frontend)
app.get('/api/location', (req, res) => {
    // Example data, you can modify it as per your needs
    const location = {
        lat: 40.730610,
        lng: -73.935242 // Example New York location
    };
    res.json(location);
});

// Define Ride Schema
const rideSchema = new mongoose.Schema({
    pickupLat: { type: Number, required: true },
    pickupLng: { type: Number, required: true },
    destination: { type: String, required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
});

// Create Ride Model
const Ride = mongoose.model('ride', rideSchema);

// Handle Ride Posting
app.post('/api/postRide', async (req, res) => {
    const { pickupLat, pickupLng, destination } = req.body;
    
    if (!pickupLat || !pickupLng || !destination) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Assuming you have the driver ID from the logged-in user
        const driverId = req.user._id; // Modify this as needed to get the driver ID

        // Create a new ride
        const newRide = new Ride({ pickupLat, pickupLng, destination, driver: driverId });
        await newRide.save();

        return res.json({ success: true, message: 'Ride posted successfully' });
    } catch (error) {
        console.error('Error posting ride:', error);
        return res.status(500).json({ success: false, message: 'Error posting ride' });
    }
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
