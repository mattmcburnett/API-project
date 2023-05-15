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
        url: 'https://images.unsplash.com/photo-1495837174058-628aafc7d610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYwM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDMwMXw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://images.unsplash.com/photo-1524748969064-cf3dabd7b84d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYyOHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDQ2MXw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYyOHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDUwMnw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://images.unsplash.com/photo-1624021309842-8a1dba5b0eaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYyOHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDU0NXw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://images.unsplash.com/photo-1651677584025-6c844f0bd65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYyOHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDU4Mnw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
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
