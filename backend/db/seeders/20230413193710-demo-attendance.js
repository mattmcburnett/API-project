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


    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3] }
    }, options);
  }
};
