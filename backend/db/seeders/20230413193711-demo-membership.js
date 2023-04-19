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
        status: 'member',
      },
      {
        userId: 3,
        groupId: 1,
        status: 'member',
      },
      {
        userId: 1,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 2,
        groupId: 2,
        status: 'co-host',
      },
      {
        userId: 3,
        groupId: 2,
        status: 'co-host',
      },
      {
        userId: 1,
        groupId: 3,
        status: 'pending',
      },
      {
        userId: 2,
        groupId: 3,
        status: 'member',
      },
      {
        userId: 3,
        groupId: 3,
        status: 'member',
      },


    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3] }
    }, options);
  }
};
