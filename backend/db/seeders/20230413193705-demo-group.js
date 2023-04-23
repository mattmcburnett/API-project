'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Dance It Up',
        about: 'We like to dance... A LOT!',
        type: 'In Person',
        private: false,
        city: 'Elmore City',
        state: 'OK'
      },
      {
        organizerId: 2,
        name: 'Bend It Like Beckham',
        about: 'GOOOOOOOOOOAAAAAALLLLLLLLL!',
        type: 'In Person',
        private: false,
        city: 'Hounslow',
        state: 'London'
      },
      {
        organizerId: 3,
        name: 'Read It and Weep',
        about: 'Bookworms Unite!',
        type: 'Online',
        private: true,
        city: 'Anywhere',
        state: 'Your Location'
      },
      {
        organizerId: 4,
        name: 'Outdoor Friends',
        about: "Let's get outiside! Hiking, backpacking, climbing, and anything else you could do outdoors.",
        type: 'In Person',
        private: false,
        city: 'Bellingham',
        state: 'WA'
      },
      {
        organizerId: 5,
        name: 'DnD Meetup',
        about: 'Plz be a DM. plz plz plz plz plz plz plz plz plz',
        type: 'In Person',
        private: true,
        city: 'San Diego',
        state: 'CA'
      },


    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Dance It Up', 'Bend It Like Beckham', 'Read It and Weep', 'Outdoor Friends', 'Dnd Meetup'] }
    });
  }
};
