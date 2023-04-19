'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: 'Dance Party',
        description: 'We gonna dance like crazy!',
        type: 'In Person',
        capacity: 50,
        price: 5,
        startDate: new Date('2023-05-31'),
        endDate: new Date('2023-05-31')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Soccer Match',
        description: 'Score some goals with us every Wednesday',
        type: 'In Person',
        capacity: 22,
        price: 10,
        startDate: new Date('2023-04-22'),
        endDate: new Date('2023-11-31')
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Book Club',
        description: 'Do you like reading? Me too!',
        type: 'Online',
        capacity: 10,
        price: 0,
        startDate: new Date('2023-05-30'),
        endDate: new Date('2023-12-31')
      }

    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Dance Party', 'Soccer Match', 'Book Club'] }
    }, options);
  }
};
