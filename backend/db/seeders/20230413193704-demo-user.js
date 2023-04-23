'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Fake1',
        lastName: 'User1',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Fake2',
        lastName: 'User2',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Fake3',
        lastName: 'User3',
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Fake4',
        lastName: 'User4',
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Fake5',
        lastName: 'User5',
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Fake6',
        lastName: 'User6',
        email: 'user6@user.io',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Fake7',
        lastName: 'User7',
        email: 'user7@user.io',
        username: 'FakeUser7',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        firstName: 'Fake8',
        lastName: 'User8',
        email: 'user8@user.io',
        username: 'FakeUser8',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        firstName: 'Fake9',
        lastName: 'User9',
        email: 'user9@user.io',
        username: 'FakeUser9',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        firstName: 'Fake10',
        lastName: 'User10',
        email: 'user10@user.io',
        username: 'FakeUser10',
        hashedPassword: bcrypt.hashSync('password10')
      },
      {
        firstName: 'Fake11',
        lastName: 'User11',
        email: 'user11@user.io',
        username: 'FakeUser11',
        hashedPassword: bcrypt.hashSync('password11')
      },
      {
        firstName: 'Fake12',
        lastName: 'User12',
        email: 'user12@user.io',
        username: 'FakeUser12',
        hashedPassword: bcrypt.hashSync('password12')
      },
      {
        firstName: 'Fake13',
        lastName: 'User13',
        email: 'user13@user.io',
        username: 'FakeUser13',
        hashedPassword: bcrypt.hashSync('password13')
      },
      {
        firstName: 'Fake14',
        lastName: 'User14',
        email: 'user14@user.io',
        username: 'FakeUser14',
        hashedPassword: bcrypt.hashSync('password14')
      },
      {
        firstName: 'Fake15',
        lastName: 'User15',
        email: 'user15@user.io',
        username: 'FakeUser15',
        hashedPassword: bcrypt.hashSync('password15')
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'FakeUser5', 'FakeUser6', 'FakeUser7', 'FakeUser8', 'FakeUser9', 'FakeUser10', 'FakeUser11', 'FakeUser12', 'FakeUser13', 'FakeUser14', 'FakeUser15'] }
    });
  }
};
