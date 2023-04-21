const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership, Venue } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



//Edit a Venue specified by its id
router.put( '/:venueId', [requireAuth],
    async (req, res, next) => {

        const { user } = req;
        const userId = user.id;

        const venueId = req.params.venueId;

        const { address, city, state, lat, lng } = req.body;

        const venue = await Venue.findByPk(venueId, {
            include: [{model: Group,
                include: [{model: Membership}]
            }]
        });

        const group = venue.Group;
        const memberships = group.Memberships;

        let currentUserStatus;
        for (let member of memberships) {
            if (userId === member.userId) {
                currentUserStatus = member.status
            };
        };

        if (group.organizerId != userId && (currentUserStatus !== 'host' && currentUserStatus !== 'co-host')) {
            const err = new Error();
            err.message = 'Forbidden';
            return res.status(403).json(err);
        };

        const errors = {};

        if(address) {
            if (typeof address === 'string'){
                venue.address = address
            } else {
                errors.address = "Street address is required"
            }
        };
        if(city) {
            if (typeof city === 'string'){
                venue.city = city
            } else {
                errors.city = "City is required"
            }
        };
        if(state) {
            if (typeof state === 'string'){
                venue.state = state
            } else {
                errors.state = "State is required"
            }
        };
        if(lat) {
            if (typeof lat === 'number'){
                venue.lat = lat
            } else {
                errors.lat = "Latitude is not valid"
            }
        };
        if(lng) {
            if (typeof lng === 'number'){
                venue.lng = lng
            } else {
                errors.lng = "Street address is required"
            }
        };


        if (errors.address || errors.city || errors.state || errors.lat || errors.lng) {
            const err = new Error();
            err.message = 'Bad Request';
            err.errors = errors;
            return res.status(400).json(err);
        }

        await venue.save();
        const resObj = {
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            state: venue.state,
            lat: venue.lat,
            lng: venue.lng
        }

        return res.json(resObj);

    }
);







module.exports = router;
