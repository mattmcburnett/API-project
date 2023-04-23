'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'https://www.fakeimage.com/1',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://www.fakeimage.com/2',
        preview: false
      },
      {
        eventId: 3,
        url: 'https://www.fakeimage.com/10',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://www.fakeimage.com/45',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://www.fakeimage.com/1000001',
        preview: false
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5] }
    });
  }
};
