const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



// Get All Events
router.get( '/',
    async (req, res, next) => {

        let {page, size, name, type, startDate} = req.query;
        const where = {};
        pagination = {};
        page = parseInt(page);
        size = parseInt(size);
        if (!page) {
            page = 1;
        };
        if(!size) {
            size = 20;
        };

        const errors = {};

        if (page < 1 || page > 10 || typeof page !== 'number') {
            errors.page = "Page must be greater than or equal to 1 and no greater than 10"
        };

        if (size < 1 || size > 20 || typeof size !== 'number') {
            errors.size = "Size must be greater than or equal to 1"
        };

        const limit = size;
        const offset = size * (page - 1);

        if(name) {
            if (typeof name !== 'string') {
                errors.name = "Name must be a string"
            } else {
                where.name = name;
            }
        };

        if(type) {
            if(type !== 'Online' && type !== 'In person' && type !== 'In Person') {
                errors.type = "Type must be 'Online' or 'In Person'"
            } else {
                where.type = type
            }
        };

        if (startDate) {
            if (startDate.length > 10 || startDate.length < 8) {
                errors.startDate = "Start date must be a valid datetime"
            } else {
                where.startDate = startDate
            }
        };

        // handle errors after filter
        if (errors.page || errors.size || errors.name || errors.type || errors.startDate) {
            const err = new Error();
            err.message = "Bad Request";
            err.errors = errors;
            return res.status(400).json(err);
        }

        const events = await Event.findAll({
            where: where,
            include: [
                {model: Group, attributes: ['id', 'name', 'city', 'state']},
                {model: Venue, attributes: ['id', 'city', 'state']},
                {model: Attendance},
                {model: EventImage}],
                limit,
                offset
        })

        for (let event of events) {
            const numAttending = event.Attendances.length
            event.dataValues.numAttending = numAttending
            for (let image of event.EventImages) {
                if (image.preview === true) {
                    event.dataValues.previewImage = image.url
                }
            }
            if(!event.dataValues.previewImage) {
                event.dataValues.previewImage = 'No preview image'
            }
            delete event.dataValues.price;
            delete event.dataValues.capacity;
            delete event.dataValues.updatedAt;
            delete event.dataValues.createdAt;
            delete event.dataValues.description;
            delete event.dataValues.EventImages;
            delete event.dataValues.Attendances;
        }
        resObj = {};
        resObj.Events = events;

        res.json(resObj);

    }
);



// Get details of an Event specified by its id
router.get( '/:eventId',
    async (req, res, next) => {
        const eventId = req.params.eventId;
        const event = await Event.findByPk(eventId, {
            attributes: { exclude: ['createdAt', 'updatedAt']},
            include: [
                {model: Group, attributes: ['id', 'name', 'private', 'city', 'state', 'organizerId'],
                    include: [{model: User, attributes: ['firstName', 'lastName']},
                              {model: GroupImage}]},
                {model: Venue, attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']},
                {model: EventImage, attributes: { exclude: ['createdAt', 'updatedAt', 'eventId']}},
                {model: Attendance}
            ]
        });

        if(!event){
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        };

        const numAttending = event.Attendances.length;
        event.dataValues.numAttending = numAttending;


        delete event.dataValues.Attendances;
        res.json(event);

    }
);




// Add an Image to a Event based on the Event's id
router.post( '/:eventId/images', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const eventId = req.params.eventId;
        const event = await Event.findByPk(eventId,{
            include: [{model: Attendance}, {model: Group, include: {model: Membership}}] //may not need user
        });

        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        }

        const editEvent = event.toJSON();

        //Proper Auth

        const attendances = editEvent.Attendances;
        let currentUserAttendance;
        for (let att of attendances) {
            if (att.userId === userId) {
                currentUserAttendance = att.status;
            };
        };

        const memberships = editEvent.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (userId === mem.userId) {
                currentUserRole = mem.status;
            };
        };

        if (currentUserAttendance !== 'attending' && currentUserRole !== 'host' && currentUserRole !== 'co-host') {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        }


        const { url, preview } = req.body;

        if(!url || (preview !== true && preview !== false)) {
            const err = new Error();
            err.message = "Please include a valid url and preview value";
            return res.status(500).json(err);
        }

        const newImage = new EventImage({
            eventId: eventId,
            url,
            preview
        });

        await newImage.save();
        delete newImage.dataValues.createdAt;
        delete newImage.dataValues.updatedAt;
        delete newImage.dataValues.eventId;

        res.json(newImage);

    }
);



// Edit an Event specified by its id
router.put( '/:eventId', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const eventId = req.params.eventId;
        const event = await Event.findByPk(eventId,{
            include: [{model: Group, include:[{model:Membership}, {model: Venue}]}] //may not need user
        });

        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        }

        const editEvent = event.toJSON();

        //Proper Auth

        const memberships = editEvent.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (userId === mem.userId) {
                currentUserRole = mem.status;
            };
        };


        if (userId !== editEvent.Group.organizerId && (currentUserRole !== 'host' && currentUserRole !== 'co-host')) {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        }


        const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body
        const venues = editEvent.Group.Venues
        const errors = {};

        if (venueId) {
            if (typeof venueId === 'number') {
                for (let ven of venues) {
                    if (venueId === ven.id) {
                        event.venueId = venueId;
                    } else {
                        errors.venueId = "Venue does not exist"
                    };
                };
            } else{
                errors.venueId = "Venue does not exist"
            };
        };

        if (name) {
            if (typeof name === 'string' && name.length >= 5) {
                event.name = name
            } else {
                errors.name = "Name must be at least 5 characters"
            }
        };

        if (type) {
            if (type === 'Online' || type === 'In person' || type === 'In Person') {
                event.type = type
            } else {
                errors.type = "Type must be Online or In person"
            }
        };

        if (capacity) {
            if (typeof capacity === 'number') {
                event.capacity = capacity
            } else {
                errors.capacity = "Capacity must be an integer"
            }
        };

        if(price) {
            if (typeof price === 'number') {
                event.price = price
            } else {
                errors.price = "Price is invalid"
            }
        };

        if (description){
            if (typeof description === 'string') {
                event.description = description
            } else {
                "Description is required"
            }
        };

        if(startDate) {
            event.startDate = startDate
        };

        if (endDate) {
            event.endDate = endDate
        };

        if (errors.venueId || errors.name || errors.type || errors.capacity || errors.price || errors.description || errors.startDate || errors.endDate) {
            const err = new Error();
            err.message = "Bad Request";
            err.errors = errors
            return res.status(400).json(err);
        }

        await event.save();

        resObj = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        };


        res.json(resObj);

    }
);



// Delete an Event specified by its id
router.delete( '/:eventId', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const eventId = req.params.eventId;

        const event = await Event.findByPk(eventId,{
            include: [{model: Group, include: {model: Membership}}] //may not need user
        });

        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        }

        const memberships = event.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (userId === mem.userId) {
                currentUserRole = mem.status;
            };
        };


        if (userId !== event.Group.organizerId && (currentUserRole !== 'host' && currentUserRole !== 'co-host')) {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        }

        await event.destroy();


        res.json({message: "Successfully deleted"});

    }
);


// Get all Attendees of an Event specified by its id
router.get( '/:eventId/attendees',
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const eventId = req.params.eventId;

        const event = await Event.findByPk(eventId,{
            include: [{model: Attendance, include: {model: User}}, {model: Group, include: {model: Membership}}]
        });

        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        }

        const memberships = event.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (userId === mem.userId) {
                currentUserRole = mem.status;
            };
        };


        const attendances = event.Attendances;
        const attendanceArray = [];
        for (let att of attendances) {
            let attObj = {}

            if (att.status === 'pending' && (currentUserRole === 'host' || currentUserRole === 'co-host' || userId === event.Group.organizerId)) {
                attObj = {
                    id: att.userId,
                    firstName: att.User.firstName,
                    lastname: att.User.lastName,
                    Attendance: {status: att.status}
                }
                attendanceArray.push(attObj);
            };

            if (att.status !== 'pending') {
                attObj = {
                    id: att.userId,
                    firstName: att.User.firstName,
                    lastname: att.User.lastName,
                    Attendance: {status: att.status}
                };
                attendanceArray.push(attObj);
            }
        }

        resObj = {
            Attendees: attendanceArray
        };

        res.json(resObj);

    }
);




// Request to Attend an Event based on the Event's id
router.post( '/:eventId/attendance', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const eventId = req.params.eventId;
        const event = await Event.findByPk(eventId,{
            include: [{model: Attendance}, {model: Group, include: {model: Membership}}] //may not need user
        });

        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        };

        const members = event.Group.Memberships;
        let isMember = false;
        for (let mem of members) {
            if (userId === mem.userId) {
                isMember = true
            }
        };

        if (isMember === false) {
            const err = new Error();
            err.message = "Must be a member of the group.";
            return res.status(404).json(err);
        };





        const attendances = event.Attendances;
        for (let att of attendances) {
            if(userId === att.userId) {
                if(att.status === 'pending') {
                    const err = new Error();
                    err.message = "Attendance has already been requested";
                    return res.status(400).json(err);
                } else {
                    const err = new Error();
                    err.message = "User is already an attendee of the event";
                    return res.status(400).json(err);
                }
            };
        };

        const newAttendance = new Attendance({
            eventId: event.id,
            userId: userId,
            status: 'pending'
        });

        await newAttendance.save();

        const resObj = {
            userId: userId,
            status: newAttendance.status
        };


        return res.json(resObj)

    }
);




// Change the status of an attendance for an event specified by id
router.put( '/:eventId/attendance', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const currentUserId = user.id;
        const eventId = req.params.eventId;
        const { userId, status } = req.body;

        if(status === 'pending') {
            const err = new Error();
            err.message = "Cannot change an attendance status to pending";
            return res.status(400).json(err);
        }

        const event = await Event.findByPk(eventId,{
            include: [{model: Group, include:[{model:Membership}]}, {model: Attendance}]
        });


        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        }


        const memberships = event.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (currentUserId === mem.userId) {
                currentUserRole = mem.status;
            };
        };


        if (currentUserRole !== 'co-host' && currentUserId !== event.Group.organizerId) {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        };

        const attendances = event.Attendances;
        let attendanceId;
        for (let att of attendances) {
            if (att.userId === userId) {
                attendanceId = att.id
            }
        };

        if(!attendanceId) {
            const err = new Error();
            err.message = "Attendance between the user and the event does not exist";
            return res.status(404).json(err);
        };

        const attendanceToUpdate = await Attendance.findByPk(attendanceId);

        attendanceToUpdate.status = status;

        await attendanceToUpdate.save();

        resObj = {
            userId: userId,
            status: attendanceToUpdate.status
        }

        return res.json(attendanceToUpdate);

    }
);





// Delete attendance to an event specified by id
router.delete( '/:eventId/attendance', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const currentUserId = user.id;
        const eventId = req.params.eventId;
        const { userId } = req.body;



        const event = await Event.findByPk(eventId,{
            include: [{model: Group, include:[{model:Membership}]}, {model: Attendance}]
        });


        if (!event) {
            const err = new Error();
            err.message = "Event couldn't be found";
            return res.status(404).json(err);
        }


        const memberships = event.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (currentUserId === mem.userId) {
                currentUserRole = mem.status;
            };
        };


        if (currentUserRole !== 'host' && currentUserId !== event.Group.organizerId && currentUserId !== userId) {
            const err = new Error();
            err.message = "Only the User or organizer may delete an Attendance";
            return res.status(403).json(err);
        };

        const attendances = event.Attendances;
        let attendanceId;
        for (let att of attendances) {
            if (att.userId === userId) {
                attendanceId = att.id
            };
        };

        if(!attendanceId) {
            const err = new Error();
            err.message = "Attendance does not exist for this User";
            return res.status(404).json(err);
        };

        const attendanceToDelete = await Attendance.findByPk(attendanceId);

        await attendanceToDelete.destroy();

        return res.json({message: "Successfully deleted attendance from event"});

    }
);







module.exports = router;
