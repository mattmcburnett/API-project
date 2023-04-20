const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership } = require('../../db/models');

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









module.exports = router;
