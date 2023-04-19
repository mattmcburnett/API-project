'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: '123 Party Street',
        city: 'Elmore City',
        state: 'OK',
        lat: 34.622998,
        lng: -97.396470
      },
      {
        groupId: 2,
        address: '246 Crossing Ave',
        city: 'Hounslow',
        state: 'London',
        lat: 51.460982,
        lng: -0.373236
      },
      {
        groupId: 3,
        address: 'README Zoom Room'
      }

    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, options);
  }
};
