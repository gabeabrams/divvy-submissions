const assert = require('assert');
const main = require('../index');

describe('index', function () {
  it.only('returns correct pairing and violations object', async function () {
    // the full list of student entries in the form: { id, isSubmitted }
    const students = [
      {
        id: 1,
        isSubmitted: true,
      },
      {
        id: 2,
        isSubmitted: true,
      },
      {
        id: 3,
        isSubmitted: true,
      },
      {
        id: 4,
        isSubmitted: true,
      },
      {
        id: 5,
        isSubmitted: true,
      },
      {
        id: 6,
        isSubmitted: true,
      },
      {
        id: 7,
        isSubmitted: true,
      },
      {
        id: 8,
        isSubmitted: true,
      },
    ];

    // a list of id arrays where each id array represents
    // the ids of students in a specific group
    const groups = [[1, 2], [3], [4, 5, 6], [7, 8]];

    // the full list of grader entries in the form: { id, proportionalWorkload }
    const graders = [
      {
        id: 1,
        proportionalWorkload: 1,
      }, {
        id: 2,
        proportionalWorkload: 1,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const bannedPairs = [
      {
        grader: 1,
        student: 5,
      },
      {
        grader: 2,
        student: 7,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const requiredPairs = [];
    const opts = {
      students,
      graders,
      bannedPairs,
      requiredPairs,
      groups,
    };

    const result = main(opts);
  });
});
