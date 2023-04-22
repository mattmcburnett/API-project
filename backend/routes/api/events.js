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

        const events = await Event.findAll({
            include: [
                {model: Group, attributes: ['id', 'name', 'city', 'state']},
                {model: Venue, attributes: ['id', 'city', 'state']},
                {model: Attendance},
                {model: EventImage}]
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
                {model: Group, attributes: ['id', 'name', 'private', 'city', 'state']},
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




module.exports = router;
