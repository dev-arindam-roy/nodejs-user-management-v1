'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const { faker } = await import('@faker-js/faker');

    const users = [];
    const dataCount = 25;

    for (let i = 0; i < dataCount; i++) {
      const plainPassword = faker.internet.password();

      users.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.hash(plainPassword, 10),
        username: faker.internet.username(),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        address: faker.location.streetAddress({ useFullAddress: true }),
        profile_image: faker.image.avatar(),
        status: faker.number.int({ min: 0, max: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  },
};
