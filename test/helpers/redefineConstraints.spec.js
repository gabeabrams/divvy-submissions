const assert = require('assert');
const Submission = require('../../classes/Submission');
const redifineConstraints = require('../../helpers/redefineConstraints');

describe('helpers > redefineConstraints', function () {
  it('returns correct graders and violations', async function () {
    // create fake data
    const fakeSubmissions = [
      new Submission([1, 2], true),
      new Submission([3], true),
      new Submission([4, 5, 6], false),
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
        grader: 2,
        student: 6,
      },
    ];

    const fakeRequiredPairs = [
      {
        grader: 2,
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

    const { graders, violationMap } = redifineConstraints(opts);

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
          {
            id: 3,
            studentIds: [4, 5, 6],
            isSubmitted: false,
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
            studentIds: [4, 5, 6],
            isSubmitted: false,
          },
        ],
        proportionalWorkload: 1,
        numToGrade: -1,
      },
    ];

    const expectedViolations = {
      1: {
        1: {
          type: 'required',
          listOfStudentsInvolved: [1, 2],
          listOfGradersInvolved: 2,
        },
        3: {
          type: 'required',
          listOfStudentsInvolved: [1, 2],
          listOfGradersInvolved: 2,
        },
      },
      2: {
        2: {
          type: 'required',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 1,
        },
        3: {
          type: 'required',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 1,
        },
      },
      3: {
        2: {
          type: 'banned',
          listOfStudentsInvolved: [4, 5, 6],
          listOfGradersInvolved: 2,
        },
      },
    };

    // spot checking each post processed fields
    graders.forEach((grader, i) => {
      // verify allowed submissions is correct
      const allowedSubmission = grader.getAllowedSubmissions();
      allowedSubmission.forEach((sub, j) => {
        // check that allowed submissions returns correct value
        assert.equal(
          JSON.stringify(sub.getStudentIds()),
          JSON.stringify(expectedGraders[i].allowedSubmissions[j].studentIds),
          'did not return correct allowed submission studentIDs'
        );
        // check that isSubmitted returns correct value
        assert.equal(
          sub.getIsSubmitted(),
          expectedGraders[i].allowedSubmissions[j].isSubmitted,
          'did not return correct isSubmitted'
        );
      });
    });

    // spot checking violations map
    Object.keys(violationMap).forEach((violationSub, i) => {
      Object.keys(violationMap[violationSub]).forEach((violationGrader) => {
        Object.keys(
          violationMap[violationSub][violationGrader]
        ).forEach((type) => {
          // violationSub (submission ids) doesn't necessarily start at 1 
          // if other tests that ran before this one have created submissions
          assert.equal(
            JSON.stringify(
              expectedViolations[i + 1][violationGrader][type]
            ),
            JSON.stringify(violationMap[violationSub][violationGrader][type]),
            'violations map does not match'
          );
        });
      });
    });
  });

  it('returns correct object w/ impossible required pair', async function () {
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

    const { graders, violationMap } = redifineConstraints(opts);

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

    const expectedViolations = {
      1: {
        1: {
          type: 'banned',
          listOfStudentsInvolved: [1, 2],
          listOfGradersInvolved: 1,
        },
      },
      2: {
        2: {
          type: 'required',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 1,
        },
        3: {
          type: 'required',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 1,
        },
      },
    };

    // spot checking each post processed fields
    graders.forEach((grader, i) => {
      // verify allowed submissions is correct
      const allowedSubmission = grader.getAllowedSubmissions();
      allowedSubmission.forEach((sub, j) => {
        // check that allowed submissions returns correct value
        assert.equal(
          JSON.stringify(sub.getStudentIds()),
          JSON.stringify(expectedGraders[i].allowedSubmissions[j].studentIds),
          'did not return correct allowed submission studentIDs'
        );
        // check that isSubmitted returns correct value
        assert.equal(
          sub.getIsSubmitted(),
          expectedGraders[i].allowedSubmissions[j].isSubmitted,
          'did not return correct isSubmitted'
        );
      });
    });

    // spot checking violations map
    Object.keys(violationMap).forEach((violationSub, i) => {
      Object.keys(violationMap[violationSub]).forEach((violationGrader) => {
        Object.keys(
          violationMap[violationSub][violationGrader]
        ).forEach((type) => {
          assert.equal(
            JSON.stringify(
              expectedViolations[i + 1][violationGrader][type]
            ),
            JSON.stringify(violationMap[violationSub][violationGrader][type]),
            'violations map does not match'
          );
        });
      });
    });
  });

  it('returns right object if student banned by all graders', async function () {
    // create fake data
    const fakeSubmissions = [
      new Submission([1, 2], true),
      new Submission([3], true),
      new Submission([4, 5, 6], false),
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
        student: 3,
      },
      {
        grader: 2,
        student: 3,
      },
      {
        grader: 3,
        student: 3,
      },
    ];

    const fakeRequiredPairs = [];

    const opts = {
      submissions: fakeSubmissions,
      graders: fakeGraders,
      bannedPairs: fakeBannedPairs,
      requiredPairs: fakeRequiredPairs,
    };

    // based on our fake data, the expected output is listed below
    const expectedGraders = [
      {
        id: 1,
        allowedSubmissions: [
          {
            id: 1,
            studentIds: [1, 2],
            isSubmitted: true,
          },
          {
            id: 3,
            studentIds: [4, 5, 6],
            isSubmitted: false,
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
          {
            id: 3,
            studentIds: [4, 5, 6],
            isSubmitted: false,
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
          {
            id: 3,
            studentIds: [4, 5, 6],
            isSubmitted: false,
          },
        ],
        proportionalWorkload: 1,
        numToGrade: -1,
      },
    ];

    const expectedViolations = {
      2: {
        1: {
          type: 'banned',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 1,
        },
        2: {
          type: 'banned',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 2,
        },
        3: {
          type: 'banned',
          listOfStudentsInvolved: [3],
          listOfGradersInvolved: 3,
        },
      },
    };

    const { graders, violationMap } = redifineConstraints(opts);

    // spot checking each post processed fields
    graders.forEach((grader, i) => {
      // verify allowed submissions is correct
      const allowedSubmission = grader.getAllowedSubmissions();
      allowedSubmission.forEach((sub, j) => {
        // check that allowed submissions returns correct value
        assert.equal(
          JSON.stringify(sub.getStudentIds()),
          JSON.stringify(expectedGraders[i].allowedSubmissions[j].studentIds),
          'did not return correct allowed submission studentIDs'
        );
        // check that isSubmitted returns correct value
        assert.equal(
          sub.getIsSubmitted(),
          expectedGraders[i].allowedSubmissions[j].isSubmitted,
          'did not return correct isSubmitted'
        );
      });
    });

    // spot checking violations map
    Object.keys(violationMap).forEach((violationSub, i) => {
      Object.keys(violationMap[violationSub]).forEach((violationGrader) => {
        Object.keys(
          violationMap[violationSub][violationGrader]
        ).forEach((type) => {
          assert.equal(
            JSON.stringify(
              expectedViolations[i + 2][violationGrader][type]
            ),
            JSON.stringify(violationMap[violationSub][violationGrader][type]),
            'violations map does not match'
          );
        });
      });
    });
  });
});
