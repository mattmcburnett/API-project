const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, GroupImage, Membership } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



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


// router.get(
//     '/current',
//     async (req, res, next) => {
//         const groups = await Group.findAll({
//             include: {model: GroupImage}
//         });

//         for(let group of groups) {
//             const numMembers = await Membership.count({
//                 where: {
//                     groupId: group.id
//                 }
//             });
//             group.dataValues.numMembers = numMembers;
//             for (let image of group.dataValues.GroupImages){
//                 if (image.preview === true) {
//                     group.dataValues.previewImage = image.url
//                 };

//             };
//             if (!group.dataValues.previewImage) group.dataValues.previewImage = 'This group does not have a preview image'
//             delete group.dataValues.GroupImages
//         }

//         const groupsObj = {};
//         groupsObj.Groups = groups;

//         res.json(groupsObj);
//     }
// );









module.exports = router;
