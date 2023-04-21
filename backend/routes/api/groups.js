const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership, Venue } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


//Get All Groups
router.get(
    '/',
    async (req, res, next) => {
        const groups = await Group.findAll({
            include: {model: GroupImage}
        });

        for(let group of groups) {
            const numMembers = await Membership.count({
                where: {
                    groupId: group.id
                }
            });
            group.dataValues.numMembers = numMembers;
            for (let image of group.dataValues.GroupImages){
                if (image.preview === true) {
                    group.dataValues.previewImage = image.url
                };

            };
            if (!group.dataValues.previewImage) group.dataValues.previewImage = 'This group does not have a preview image'
            delete group.dataValues.GroupImages
        }

        const groupsObj = {};
        groupsObj.Groups = groups;

        res.json(groupsObj);
    }
);

//Get all Groups joined or organized by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;

        const foundUser = await User.findByPk(userId, {
            include: {model: Membership}
        })
        const userPlusGroups = foundUser.toJSON();
        const userMemberships = userPlusGroups.Memberships;
        const userGroups = [];

        for (let membership of userMemberships) {
            const group = await Group.findByPk(membership.groupId,
                { include: GroupImage });
            const groupToPush = group.toJSON();

            const numMembers = await Membership.count({
                where: {
                    groupId: groupToPush.id
                }
            });
            groupToPush.numMembers = numMembers;

            for (let image of groupToPush.GroupImages){
                if (image.preview === true) {
                    groupToPush.previewImage = image.url
                };
            };
            if (!groupToPush.previewImage) groupToPush.previewImage = 'This group does not have a preview image'
            delete groupToPush.GroupImages;
            userGroups.push(groupToPush);
        }

        const groupsObj = {};
        groupsObj.Groups = userGroups;

        res.json(groupsObj);
    }
);

//Get details of a Group from an id
router.get(
    '/:groupId',
    async (req, res, next) => {
        const { groupId } = req.params;

        const group = await Group.findByPk(groupId, {
            include: [
                {model: GroupImage, attributes: ['id', 'url', 'preview']},
                {model: Venue, attributes: {exclude: ['createdAt', 'updatedAt']}}]
        })
        //error handling
        if(!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        }

        const resGroup = group.toJSON();

        const images = resGroup.GroupImages;

        const organizer = await User.findByPk(resGroup.organizerId, {
            attributes: ['id', 'firstName', 'lastName']
        });

        resGroup.Organizer = organizer;

        const numMembers = await Membership.count({
            where: {
                groupId: resGroup.id
            }
        });

        resGroup.numMembers = numMembers;

        return res.json(resGroup);
    }
);


const validateNewGroup = [
    check('name')
      .exists({ checkFalsy: true })
      .isString()
      .isLength({max: 60})
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({ checkFalsy: true })
      .isString()
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .isIn(['Online', 'In person', 'In Person'])
      .withMessage('Username cannot be an email.'),
    check('private')
      .exists({ checkFalsy: true })
      .isBoolean()
      .withMessage('Private must be a boolean'),
    check('city')
      .exists({ checkFalsy: true })
      .isString()
      .withMessage("City is required"),
    check('state')
      .exists({ checkFalsy: true })
      .isString()
      .withMessage("State is required"),
    handleValidationErrors
  ];



//Create A Group
router.post( '/', [requireAuth, validateNewGroup],
    async (req, res, next) => {

        const { user } = req;
        const userId = user.id;
        const { name, about, type, private, city, state } = req.body

        const newGroup = new Group({
            organizerId: userId,
            name,
            about,
            type,
            private,
            city,
            state
        });

        await newGroup.save();

        return res.status(401).json(newGroup);

    }
);

// Add an Image to a Group based on the Group's id
router.post( '/:groupId/images', [requireAuth],
    async (req, res, next) => {

        const { user } = req;
        const userId = user.id;

        const groupId = req.params.groupId;

        const { url, preview } = req.body;

        const group = await Group.findByPk(groupId);

        if (!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        }

        if (group.organizerId != userId) {
            const err = new Error();
            err.message = 'Forbidden';
            return res.status(403).json(err);
        };

        const newImage = new GroupImage({
            groupId: groupId,
            url,
            preview
        })

        await newImage.save();

        const resObj = {
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        };

        return res.json(resObj);

    }
);


// Edit A Group
router.put( '/:groupId', [requireAuth],
    async (req, res, next) => {

        const { user } = req;
        const userId = user.id;

        const groupId = req.params.groupId;

        const { name, about, type, private, city, state } = req.body;

        const group = await Group.findByPk(groupId);

        if (!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        }

        if (group.organizerId != userId) {
            const err = new Error();
            err.message = 'Forbidden';
            return res.status(403).json(err);
        };

        const errors = {};

        if(name){
            if (name.length > 60){
                errors.name = "Name must be 60 characters or less"
            } else {
                group.name = name;
            }
        }
        if(about) {
            if(about.length < 50) {
                errors.about = "About must be 50 characters or more"
            } else {
                group.about = about;
            }
        }
        if(type) {
            if(type === 'Online' || type === 'In person' || type === 'In Person') {
                group.type = type;
            } else {
                errors.type = "Type must be 'Online' or 'In person'"
            }
        }
        if(!(private === true || private === false)) {
            if(private != true || private != 'true' || private != false || private != 'false') {
                errors.private = "Private must be a boolean"
            } else {
                group.private = private;
            }
        };
        if (private === true || private === false) group.private = private;
        if(city) {
            if(typeof city != 'string') {
                errors.city = "City is required"
            } else {
                group.city = city;
            }
        }
        if(state) {
            if(typeof state != 'string') {
                errors.state = "State is required"
            } else {
                group.state = state;

            }
        }
        console.log(errors)

        if (errors.name || errors.about || errors.type || errors.private || errors.city || errors.state) {
            const err = new Error();
            err.message = 'Bad Request';
            err.errors = errors;
            return res.status(400).json(err);
        }

        await group.save();

        return res.json(group);

    }
);


// Delete A Group
router.delete( '/:groupId', [requireAuth],
    async (req, res, next) => {

        const { user } = req;
        const userId = user.id;

        const groupId = req.params.groupId;

        const group = await Group.findByPk(groupId);

        if (!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        }

        if (group.organizerId != userId) {
            const err = new Error();
            err.message = 'Forbidden';
            return res.status(403).json(err);
        };

        await group.destroy();

        return res.json({message: "Successfully deleted"})

    }
);


// Get All Venues for a Group specified by its id
router.get( '/:groupId/venues', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;

        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId, {
            include: [{model: Venue, attributes: {
                exclude: ['createdAt', 'updatedAt']
            }}, {model: Membership}]
        });

        if (!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        };

        const editGroup = group.toJSON();
        const memberships = editGroup.Memberships;

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

        const resObj = {};
        resObj.Venues = group.Venues;

        res.json(resObj);

    }
);



const validateNewVenue = [
    check('address')
      .exists({ checkFalsy: true })
      .isString()
      .withMessage("Street address is required"),
    check('city')
      .exists({ checkFalsy: true })
      .isString()
      .withMessage("City is required"),
    check('state')
      .isString()
      .withMessage('State is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .withMessage("Latitude is not valid"),
    check('lng')
      .exists({ checkFalsy: true })
      .withMessage("Longitude is not valid"),
    handleValidationErrors
  ];



// Create a new Venue for a Group specified by its id
router.post( '/:groupId/venues', [requireAuth, validateNewVenue],
    async (req, res, next) => {

        const { user } = req;
        const userId = user.id;

        const groupId = req.params.groupId;

        const group = await Group.findByPk(groupId, {
            include: [{model: Membership}]
        });

        if (!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        }

        const editGroup = group.toJSON();
        const memberships = editGroup.Memberships;

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

        const { address, city, state, lat, lng} = req.body;

        const newVenue = new Venue({
            groupId: groupId,
            address,
            city,
            state,
            lat,
            lng
        });

        await newVenue.save();

        resObj = {
            id: newVenue.id,
            groupId: groupId,
            address,
            city,
            state,
            lat,
            lng
        }

        res.json(resObj);


    }
);



module.exports = router;
