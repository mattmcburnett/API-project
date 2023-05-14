const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');

const router = express.Router();


//Get All Groups
router.get(
    '/',
    async (req, res, next) => {
        const groups = await Group.findAll({
            include: [{model: GroupImage}, {model:Event}]
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
        // console.log(groupsObj)

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
                {model: Venue, attributes: {exclude: ['createdAt', 'updatedAt']}},
                {model: Event, include:[{model: EventImage}]}
            ]
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

        return res.json(newGroup);

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


// Get all Events of a Group specified by its id
router.get( '/:groupId/events',
    async (req, res, next) => {
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId);
        if(!group){
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        }

        const events = await Event.findAll({ where: {groupId: groupId},
            include: [
                {model: Group, attributes: ['id', 'name', 'city', 'state']},
                {model: Venue, attributes: ['id', 'city', 'state']},
                {model: Attendance}, {model: EventImage}]
            }
        )

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


        const resObj = {};
        resObj.Events = events;

        res.json(resObj);
    }
);






const validateNewEvent = [
    check('venueId')
      .exists({ checkFalsy: true })
      .isInt()
      .withMessage("Venue does not exist"),
    check('name')
      .exists({ checkFalsy: true })
      .isString()
      .isLength({min: 5})
      .withMessage("Name must be at least 5 characters"),
    check('type')
      .exists({ checkFalsy: true })
      .isIn(['Online', 'In person', 'In Person'])
      .withMessage("Type must be Online or In person"),
    check('capacity')
      .exists({ checkFalsy: true })
      .isInt()
      .withMessage("Capacity must be an integer"),
    check('price')
      .exists()
      .isNumeric()
      .withMessage("Price is invalid"),
    check('description')
      .exists({ checkFalsy: true })
      .isString()
      .withMessage("Description is required"),
    check('startDate')
      .exists()
    //   .isDate()
      .withMessage("invalid start date"),
    check('endDate')
      .exists()
    //   .isDate()
      .withMessage("invalid end date"),
      handleValidationErrors
]


// Create an Event for a Group specified by its id
router.post( '/:groupId/events', [requireAuth, validateNewEvent],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const groupId = req.params.groupId;

        console.log('req body price =======>', req.body.price)

        const group = await Group.findByPk(groupId, {
            include: [{model: Membership}]
        });

        if(!group) {
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


        const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body;

        const newEvent = new Event({
            groupId: groupId,
            organizerId:userId,
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate
        });

        await newEvent.save();

        delete newEvent.dataValues.createdAt;
        delete newEvent.dataValues.updatedAt;

        res.json(newEvent);
    }
);




// Get all Members of a Group specified by its id
router.get(
    '/:groupId/members',
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const { groupId } = req.params;

        const group = await Group.findByPk(groupId, {
            include: [{model: Membership, include: {model: User}}]
        });

        if(!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        };

        const memberships = group.Memberships;

        let currentUserStatus;
        for (let member of memberships) {
            if (userId === member.userId) {
                currentUserStatus = member.status
            };
        };
        if (!currentUserStatus) currentUserStatus = 'none'

        if (group.organizerId === userId || currentUserStatus === 'host' || currentUserStatus === 'co-host') {

            const memArray = []
            for (let member of memberships) {
                const memberObj = {
                    id: member.id,
                    firstName: member.User.firstName,
                    lastName: member.User.lastName,
                    Membership: {status: member.status}
                };
                memArray.push(memberObj);
            }
            resObj = {
                Members: memArray
            };

            return res.json(resObj)

        } else {

            const memArray = []
            for (let member of memberships) {
                console.log(member.toJSON())
                if (member.status !== 'pending'){
                    const memberObj = {
                    id: member.id,
                    firstName: member.User.firstName,
                    lastName: member.User.lastName,
                    Membership: {status: member.status}
                    };
                    memArray.push(memberObj);
                };
            };
            resObj = {
                Members: memArray
            };

            return res.json(resObj)
        }

    }
);


// Request a Membership for a Group based on the Group's id
router.post(
    '/:groupId/membership', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const { groupId } = req.params;

        const group = await Group.findByPk(groupId, {
            include: [{model: Membership, include: {model: User}}]
        });

        if(!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        };

        const memberships = group.Memberships;

        let currentUserStatus;
        for (let member of memberships) {
            if (userId === member.userId) {
                currentUserStatus = member.status
            };
        };
        if (!currentUserStatus) {
            const newMembership = new Membership({
                userId: userId,
                groupId: groupId,
                status: 'pending'
            });

            await newMembership.save();

            return res.json({memberId: newMembership.id, status: newMembership.status});
        };

        if (currentUserStatus === 'pending') {
            const err = new Error();
            err.message = "Membership has already been requested";
            return res.status(400).json(err);
        };

        if(currentUserStatus === 'member' || currentUserStatus === 'host' || currentUserStatus === 'co-host') {
            const err = new Error();
            err.message = "User is already a member of the group";
            return res.status(400).json(err);
        }
    }
);



// Change the status of a membership for a group specified by id
router.put(
    '/:groupId/membership', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const { groupId } = req.params;

        const group = await Group.findByPk(groupId, {
            include: [{model: Membership}]
        });
        //if not group 404
        if(!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        };

        const { memberId, status } = req.body;
        const memberships = group.Memberships;
        let currentUserStatus;
        for (let member of memberships) {
            if (userId === member.userId) {
                currentUserStatus = member.status
            };
        };
        // users not in the group, pending, or basic members can't update
        if (!currentUserStatus || currentUserStatus === 'pending' || currentUserStatus === 'member') {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        }
        //cannot change status to pending
        if (status === 'pending') {
            const err = new Error();
            err.message = "Validations Error";
            err.errors = {status: "Cannot change a membership status to pending"}
            return res.status(400).json(err);
        };

        if (userId !== group.organizerId && (status === 'co-host' || status === 'host')) {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        };

        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                id:memberId
            }
        });
        //if no membership 404
        if (!membership) {
            const err = new Error();
            err.message = "Validations Error";
            err.errors = {memberId: "User couldn't be found"}
            return res.status(400).json(err);
        };

        membership.status = status;

        await membership.save();

        return res.json({
            memberId: membership.id,
            status: status
        });

    }
);


router.delete('/:groupId/membership', [requireAuth],
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id;
        const { groupId } = req.params;
        const { memberId } = req.body

        const group = await Group.findByPk(groupId, {
            include: [{model: Membership}]
        });

        if(!group) {
            const err = new Error();
            err.message = "Group couldn't be found";
            return res.status(404).json(err);
        };

        const memberships = group.Memberships;
        let currentUserStatus;
        for (let member of memberships) {
            if (userId === member.userId) {
                currentUserStatus = member.status
            };
        };

        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                id: memberId
            }
        });

        if(!membership) {
            const err = new Error();
            err.message = "Validation Error";
            err.errors = {memberId: "User couldn't be found"}
            return res.status(400).json(err);
        }

        if (membership.userId !== userId && currentUserStatus !== 'host') {
            const err = new Error();
            err.message = "Forbidden";
            return res.status(403).json(err);
        }

        if (membership.userId === userId || currentUserStatus === 'host') {
            membership.destroy();
            return res.json({message: "Successfully deleted membership from group"})
        };

    }
)




module.exports = router;
