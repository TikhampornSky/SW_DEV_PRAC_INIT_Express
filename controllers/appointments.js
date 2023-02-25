const Appointment = require('../models/Appointment');

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Public
exports.getAppointments = async (req, res, next) => {
    let query;
    // General users can see only their appointments!
    if (req.user.role === 'user') {
        query = Appointment.find({user: req.user.id}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    } else { // If you are an admin, you can see all appointments!
        query = Appointment.find().populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }

    try {
        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, message: "Cannot find Appointments"});
    }
}