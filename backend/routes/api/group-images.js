const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


router.delete('/:imageId', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const imageId = req.params.imageId

        const image = await GroupImage.findByPk(imageId,
            { include: [{model: Group,
                include: [{model: Membership}]
            }]
        });

        if (!image) {
            const err = new Error();
            err.message = "Group Image couldn't be found";
            return res.status(404).json(err);
        }

        const memberships = image.Group.Memberships
        let currentUserRole;
        for (let mem of memberships) {
            if (userId === mem.userId) {
                currentUserRole = mem.status;
            };
        };

        if (currentUserRole !== 'co-host' && currentUserRole !== 'host' && userId !== image.Group.organizerId) {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        };

        await image.destroy()

        return res.json({message: "Successfully deleted"});

    }
)















module.exports = router;
