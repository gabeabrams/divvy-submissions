const assert = require('assert');
const main = require('../index');

describe('index', function () {
  it('returns correct pairing and violations object', async function () {
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
      isDeterministic: true,
    };

    const expectedWorkloadMap = {
      1: 2,
      2: 2,
    };

    const expectedStudentToGrader = {
      1: 2,
      2: 2,
      3: 1,
      4: 2,
      5: 2,
      6: 2,
      7: 1,
      8: 1,
    };

    const {
      studentToGraderMap,
      workloadMap,
      constraintViolations,
    } = main(opts);

    Object.keys(studentToGraderMap).forEach((studentId) => {
      assert.equal(
        studentToGraderMap[studentId],
        expectedStudentToGrader[studentId],
        'did not return correct pairing'
      );
    });

    Object.keys(workloadMap).forEach((graderId) => {
      assert.equal(
        workloadMap[graderId],
        expectedWorkloadMap[graderId],
        'did not return correct workload'
      );
    });

    assert.equal(
      constraintViolations.length,
      0,
      'did not return correct violations'
    );
  });

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
    ];

    // a list of id arrays where each id array represents
    // the ids of students in a specific group
    const groups = [[1, 2], [3]];

    // the full list of grader entries in the form: { id, proportionalWorkload }
    const graders = [
      {
        id: 1,
        proportionalWorkload: 1,
      }, {
        id: 2,
        proportionalWorkload: 1,
      }, {
        id: 3,
        proportionalWorkload: 1,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const bannedPairs = [
      {
        grader: 1,
        student: 2,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const requiredPairs = [
      {
        grader: 2,
        student: 1,
      },
      {
        grader: 3,
        student: 1,
      },
    ];

    const opts = {
      students,
      graders,
      bannedPairs,
      requiredPairs,
      groups,
      isDeterministic: true,
    };

    const expectedViolations = [{
      englishDescription: 'More than one grader is required to grade this student.',
      type: 'required',
      listOfStudentsInvolved: [1],
      listOfGradersInvolved: [2, 3],
    }];

    const { constraintViolations } = main(opts);

    constraintViolations.forEach((violation, i) => {
      Object.keys(violation).forEach((violationField) => {
        assert.equal(
          JSON.stringify(violation[violationField]),
          JSON.stringify(expectedViolations[i][violationField]),
          'did not return correct violations'
        );
      });
    });
  });

  it('returns correct pairing and violations object', async function () {
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
    ];

    // a list of id arrays where each id array represents
    // the ids of students in a specific group
    const groups = [[1, 2]];

    // the full list of grader entries in the form: { id, proportionalWorkload }
    const graders = [
      {
        id: 1,
        proportionalWorkload: 1,
      }, {
        id: 2,
        proportionalWorkload: 1,
      }, {
        id: 3,
        proportionalWorkload: 1,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const bannedPairs = [
      {
        grader: 1,
        student: 2,
      },
      {
        grader: 2,
        student: 2,
      },
      {
        grader: 3,
        student: 2,
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
      isDeterministic: true,
    };

    const result = main(opts);
  });

  it('returns correct pairing with randomization', async function () {
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
    ];

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
    const bannedPairs = [];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const requiredPairs = [];

    const opts = {
      students,
      graders,
      bannedPairs,
      requiredPairs,
      isDeterministic: false,
    };

    // running this test multiple times can result in different pairings,
    // showing randomizaiton works
    const result = main(opts);
  });

  it('returns randomized pairing w/ varying workloads', async function () {
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
    ];

    // the full list of grader entries in the form: { id, proportionalWorkload }
    const graders = [
      {
        id: 1,
        proportionalWorkload: 2,
      }, {
        id: 2,
        proportionalWorkload: 1,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const bannedPairs = [];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const requiredPairs = [];

    const opts = {
      students,
      graders,
      bannedPairs,
      requiredPairs,
      isDeterministic: false,
    };

    // running this test multiple times can result in different pairings,
    // showing randomizaiton works
    const result = main(opts);
  });

  it('returns correct pairing in group assignment', async function () {
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
    ];

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

    // a list of id arrays where each id array represents
    // the ids of students in a specific group
    const groups = [[1, 2], [3, 4, 5]];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const bannedPairs = [];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const requiredPairs = [];

    const opts = {
      students,
      graders,
      groups,
      bannedPairs,
      requiredPairs,
      isDeterministic: true,
    };

    // ensures every student is assigned and students in each group is assigned
    // the same grader
    const expectedStudentToGrader = {
      1: 1,
      2: 1,
      3: 2,
      4: 2,
      5: 2,
    };

    // running this test multiple times can result in different pairings,
    // showing randomizaiton works
    const { studentToGraderMap } = main(opts);
    Object.keys(studentToGraderMap).forEach((studentId) => {
      assert.equal(
        studentToGraderMap[studentId],
        expectedStudentToGrader[studentId],
        'did not return correct pairing in a group assignment'
      );
    });
  });
});
