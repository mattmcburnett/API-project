'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 2,
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 3,
        status: 'pending',
      },
      {
        eventId: 1,
        userId: 4,
        status: 'not attending',
      },
      {
        eventId: 1,
        userId: 3,
        status: 'waitlist',
      },
      {
        eventId: 2,
        userId: 1,
        status: 'not attending',
      },
      {
        eventId: 2,
        userId: 2,
        status: 'attending',
      },
      {
        eventId: 2,
        userId: 3,
        status: 'attending',
      },
      {
        eventId: 2,
        userId: 15,
        status: 'attending',
      },
      {
        eventId: 2,
        userId: 14,
        status: 'pending',
      },
      {
        eventId: 2,
        userId: 13,
        status: 'attending',
      },
      {
        eventId: 3,
        userId: 1,
        status: 'waitlist',
      },
      {
        eventId: 3,
        userId: 2,
        status: 'attending',
      },
      {
        eventId: 3,
        userId: 3,
        status: 'attending',
      },
      {
        eventId: 3,
        userId: 10,
        status: 'waitlist',
      },
      {
        eventId: 3,
        userId: 11,
        status: 'pending',
      },
      {
        eventId: 4,
        userId: 11,
        status: 'attending',
      },
      {
        eventId: 4,
        userId: 10,
        status: 'waitlist',
      },
      {
        eventId: 4,
        userId: 9,
        status: 'pending',
      },
      {
        eventId: 4,
        userId: 8,
        status: 'pending',
      },
      {
        eventId: 5,
        userId: 6,
        status: 'attending',
      },
      {
        eventId: 5,
        userId: 4,
        status: 'attending',
      },
      {
        eventId: 5,
        userId: 12,
        status: 'attending',
      },
      {
        eventId: 5,
        userId: 3,
        status: 'pending',
      },
      {
        eventId: 5,
        userId: 7,
        status: 'pending',
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5] }
    });
  }
};
