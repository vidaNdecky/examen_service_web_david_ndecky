const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    dayOfWeek(date: String!): DayOfWeek
  }

  type DayOfWeek {
    date: String
    day: String
  }
`);

module.exports = schema