import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import config from 'config';
import User from './models/User';
import { timeEnd } from 'console';

// Initialize express application
const app = express();

// Connect database
connectDatabase();

// Configure Middleware
app.use(express.json({ extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

// API endpoints
/**
 * @route GET /
 * @desc Test endpoint
 */
app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */
app.post(
    '/api/users', 
    [
        check('name', 'Please enter your name')
            .not()
            .isEmpty(),
        check('date', 'Please enter a valid date in format of YYYY-MM-DD')
            .isDate(),
        check('mileage', 'Please enter a run mileage 00.00')
            .isNumeric(),
        check('time', 'Please enter completed run time in format of 00.00')
            .isNumeric()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array() });
        } else {
          const { name, date, mileage, time } = req.body;
          try {
            // Check if user exists
            let user = await User.findOne({ date: date });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Run date already recorded'}] });
            }

            // Create a new user/date
            user = new User({
                name: name,
                date: date,
                mileage: mileage,
                time: time
            });

            // Save to the db and return
            await user.save();
            res.send('User successfully registered');
            }   catch (error) {
            res.status(500).send('Server error');
            }
        }
    }
);

// Connection listener
const port = 5000;
app.listen(port, () => console.log('Express server running on port ${port}'));