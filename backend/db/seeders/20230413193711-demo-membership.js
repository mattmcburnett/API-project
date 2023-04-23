'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'host',
      },
      {
        userId: 2,
        groupId: 1,
        status: 'co-host',
      },
      {
        userId: 3,
        groupId: 1,
        status: 'member',
      },
      {
        userId: 7,
        groupId: 1,
        status: 'pending',
      },
      {
        userId: 15,
        groupId: 1,
        status: 'pending',
      },
      {
        userId: 1,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 12,
        groupId: 2,
        status: 'host',
      },
      {
        userId: 13,
        groupId: 2,
        status: 'co-host',
      },
      {
        userId: 10,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 6,
        groupId: 2,
        status: 'pending',
      },
      {
        userId: 8,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 13,
        groupId: 3,
        status: 'host',
      },
      {
        userId: 11,
        groupId: 3,
        status: 'member',
      },
      {
        userId: 4,
        groupId: 3,
        status: 'member',
      },
      {
        userId: 2,
        groupId: 3,
        status: 'pending',
      },
      {
        userId: 4,
        groupId: 4,
        status: 'host',
      },
      {
        userId: 5,
        groupId: 4,
        status: 'member',
      },
      {
        userId: 6,
        groupId: 4,
        status: 'pending',
      },
      {
        userId: 7,
        groupId: 4,
        status: 'co-host',
      },
      {
        userId: 8,
        groupId: 4,
        status: 'member',
      },
      {
        userId: 15,
        groupId: 5,
        status: 'host',
      },
      {
        userId: 14,
        groupId: 5,
        status: 'member',
      },
      {
        userId: 13,
        groupId: 5,
        status: 'pending',
      },
      {
        userId: 12,
        groupId: 5,
        status: 'co-host',
      },
      {
        userId: 11,
        groupId: 5,
        status: 'pending',
      }


    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    });
  }
};
