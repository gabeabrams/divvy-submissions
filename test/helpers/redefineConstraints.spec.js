const assert = require('assert');
const Submission = require('../../classes/Submission');
const redifineConstraints = require('../../helpers/redefineConstraints');

describe('helpers > redifineConstraints', function () {
  it('returns correct submissions for individual homeworks', async function () {
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

    // { grader: <grader id>, student: <student id> }
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

    redifineConstraints(opts);
  });
});
