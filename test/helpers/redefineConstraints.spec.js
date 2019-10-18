const assert = require('assert');
const Submission = require('../../classes/Submission');
const redifineConstraints = require('../../helpers/redefineConstraints');

describe('helpers > redifineConstraints', function () {
  it('returns correct graders w/ impossible required pair', async function () {
    // create fake data
    const fakeSubmissions = [
      new Submission([1, 2], true),
      new Submission([3], true),
    ];

    const fakeGraders = [
      {
        id: 1,
        proportionalWorkload: 1,
      },
      {
        id: 2,
        proportionalWorkload: 1,
      },
      {
        id: 3,
        proportionalWorkload: 1,
      },
    ];

    const fakeBannedPairs = [
      {
        grader: 1,
        student: 2,
      },
    ];

    const fakeRequiredPairs = [
      {
        grader: 2,
        student: 1,
      },
      {
        grader: 3,
        student: 1,
      },
      {
        grader: 1,
        student: 3,
      },
    ];

    const opts = {
      submissions: fakeSubmissions,
      graders: fakeGraders,
      bannedPairs: fakeBannedPairs,
      requiredPairs: fakeRequiredPairs,
    };

    const graders = redifineConstraints(opts);

    // based on our fake data, the expected output is listed below
    const expectedGraders = [
      {
        id: 1,
        allowedSubmissions: [
          {
            id: 2,
            studentIds: [3],
            isSubmitted: true,
          },
        ],
        proportionalWorkload: 1,
        numToGrade: -1,
      },
      {
        id: 2,
        allowedSubmissions: [
          {
            id: 1,
            studentIds: [1, 2],
            isSubmitted: true,
          },
        ],
        proportionalWorkload: 1,
        numToGrade: -1,
      },
      {
        id: 3,
        allowedSubmissions: [
          {
            id: 1,
            studentIds: [1, 2],
            isSubmitted: true,
          },
        ],
        proportionalWorkload: 1,
        numToGrade: -1,
      },
    ];

    assert.equal(JSON.stringify(graders), JSON.stringify(expectedGraders), 'not equal');
  });
});
