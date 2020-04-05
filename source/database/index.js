const faker = require('faker/locale/en_US');
const generatedPosts = Array.apply(null, Array(20)).map((_, index) => ({
    id: index + 1,
    title: faker.lorem.words(5),
    desc: faker.lorem.paragraphs(5),
}));

/**
 * @description In future, this module is coming to real database implementation
 * @type {{id: number, title: string, desc: string}[]}
 */
exports.database = generatedPosts;
