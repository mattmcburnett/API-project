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
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYwM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDAxNnw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://images.unsplash.com/photo-1524015368236-bbf6f72545b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYwM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk1OTkxMnw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYwM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDA2MXw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        groupId: 4,
        url: 'https://images.unsplash.com/photo-1568226292321-dd67ff8b3b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYwM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDEyM3w&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },
      {
        groupId: 5,
        url: 'https://images.unsplash.com/photo-1650024520239-c7fc2bbfa340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NDYwM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY4Mzk2MDE5MHw&ixlib=rb-4.0.3&q=80&w=1080',
        preview: true
      },


    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    });
  }
};
