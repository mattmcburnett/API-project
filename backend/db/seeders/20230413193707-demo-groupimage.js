'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'https://www.fakeimage.com/4',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://www.fakeimage.com/5',
        preview: false
      },
      {
        groupId: 3,
        url: 'https://www.fakeimage.com/6',
        preview: true
      },


    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, options);
  }
};
