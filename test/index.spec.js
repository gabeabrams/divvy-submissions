const assert = require('assert');
const divvy = require('../index');

describe('index', function () {
  it('returns correct pairing and violations object - test set 1', async function () {
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
    } = divvy(opts);

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

  it('returns correct pairing and violations object - test set 2', async function () {
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

    const { constraintViolations } = divvy(opts);

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

  it('returns correct pairing and violations object - test set 3', async function () {
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

    // running the algorithm
    const { constraintViolations } = divvy(opts);

    const expectedDescription = 'This grader is banned from grading this submission.';
    const expectedType = 'banned';

    assert.equal(
      constraintViolations[0].englishDescription,
      expectedDescription,
      'did not return correct violation description'
    );
    assert.equal(
      constraintViolations[0].type,
      expectedType,
      'did not return correct violations type'
    );
  });

  it('returns correct pairing when both required and banned to grade a submissions', async function () {
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
        grader: 1,
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
      englishDescription: 'This grader is banned from grading this submission.',
      type: 'banned',
      listOfStudentsInvolved: [1, 2],
      listOfGradersInvolved: [1],
    }];

    // running the algorithm
    const { constraintViolations } = divvy(opts);

    // check if constraintViolations matches expected result
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
    let firstSolutionFound;
    let secondSolutionFound;
    for (let i = 0; i < 1000; i++) {
      const { studentToGraderMap, constraintViolations } = divvy(opts);

      // check that all student is assigned a grader
      assert.equal(
        Object.keys(studentToGraderMap).length,
        students.length,
        'not all students have been assigned'
      );

      // check if there are no constraint violations
      assert.equal(
        constraintViolations.length,
        0,
        'did not return correct violations'
      );

      // Figure out which solution this is
      if (
        studentToGraderMap[1]
        && studentToGraderMap[1] === 1
        && studentToGraderMap[2]
        && studentToGraderMap[2] === 2
      ) {
        // First solution
        firstSolutionFound = true;
      } else if (
        studentToGraderMap[1]
        && studentToGraderMap[1] === 2
        && studentToGraderMap[2]
        && studentToGraderMap[2] === 1
      ) {
        // Second solution
        secondSolutionFound = true;
      } else {
        // Invalid solution
        throw new Error('Invalid solution');
      }

      // If both solutions are found, stop searching/iterating
      if (firstSolutionFound && secondSolutionFound) {
        break;
      }
    }

    // Make sure we found both solutions
    if (!firstSolutionFound || !secondSolutionFound) {
      throw new Error('Ran randomized algorithm 1000 times and did not find variation in solutions');
    }
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
    let firstSolutionFound;
    let secondSolutionFound;
    let thirdSolutionFound;
    for (let i = 0; i < 1000; i++) {
      const { studentToGraderMap, constraintViolations } = divvy(opts);

      // check that all student is assigned a grader
      assert.equal(
        Object.keys(studentToGraderMap).length,
        students.length,
        'not all students have been assigned'
      );

      // check if there are no constraint violations
      assert.equal(
        constraintViolations.length,
        0,
        'did not return correct violations'
      );

      // Figure out which solution this is
      if (
        studentToGraderMap[1]
        && studentToGraderMap[1] === 1
        && studentToGraderMap[2]
        && studentToGraderMap[2] === 1
        && studentToGraderMap[3]
        && studentToGraderMap[3] === 2
      ) {
        // First solution
        firstSolutionFound = true;
      } else if (
        studentToGraderMap[1]
        && studentToGraderMap[1] === 1
        && studentToGraderMap[2]
        && studentToGraderMap[2] === 2
        && studentToGraderMap[3]
        && studentToGraderMap[3] === 1
      ) {
        // Second solution
        secondSolutionFound = true;
      } else if (
        studentToGraderMap[1]
        && studentToGraderMap[1] === 2
        && studentToGraderMap[2]
        && studentToGraderMap[2] === 1
        && studentToGraderMap[3]
        && studentToGraderMap[3] === 1
      ) {
        // Third solution
        thirdSolutionFound = true;
      } else {
        // Invalid solution
        throw new Error('Invalid solution');
      }

      // If both solutions are found, stop searching/iterating
      if (firstSolutionFound && secondSolutionFound && thirdSolutionFound) {
        break;
      }
    }

    // Make sure we found both solutions
    if (!firstSolutionFound || !secondSolutionFound || !thirdSolutionFound) {
      throw new Error('Ran randomized algorithm 1000 times and did not find variation in solutions');
    }
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

    // run the algorithm
    const { studentToGraderMap } = divvy(opts);

    // check if studentToGraderMap matches expected result
    Object.keys(studentToGraderMap).forEach((studentId) => {
      assert.equal(
        studentToGraderMap[studentId],
        expectedStudentToGrader[studentId],
        'did not return correct pairing in a group assignment'
      );
    });
  });

  it('returns correct pairing in complex problem', async function () {
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
    ];

    // the full list of grader entries in the form: { id, proportionalWorkload }
    const graders = [
      {
        id: 1,
        proportionalWorkload: 1,
      }, {
        id: 2,
        proportionalWorkload: 2,
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
        grader: 1,
        student: 3,
      },
      {
        grader: 1,
        student: 4,
      },
    ];

    // a list of pairs in the form:
    // { grader: <grader id>, student: <student id> }
    const requiredPairs = [
      {
        grader: 1,
        student: 1,
      },
      {
        grader: 2,
        student: 2,
      },
      {
        grader: 2,
        student: 6,
      },
    ];

    const opts = {
      students,
      graders,
      bannedPairs,
      requiredPairs,
      isDeterministic: true,
    };

    const expectedStudentToGrader = {
      1: 1,
      2: 2,
      3: 2,
      4: 2,
      5: 1,
      6: 2,
    };

    const expectedWorkloadMap = {
      1: 2,
      2: 4,
    };

    // run the algorithm
    const {
      studentToGraderMap,
      workloadMap,
      constraintViolations,
    } = divvy(opts);

    // check if studentToGraderMap matches expected result
    Object.keys(studentToGraderMap).forEach((studentId) => {
      assert.equal(
        studentToGraderMap[studentId],
        expectedStudentToGrader[studentId],
        'did not return correct pairing in a group assignment'
      );
    });

    // check if workloadMap matches expected result
    Object.keys(workloadMap).forEach((graderId) => {
      assert.equal(
        workloadMap[graderId],
        expectedWorkloadMap[graderId],
        'did not return correct workload'
      );
    });

    // check if there are no constraint violations
    assert.equal(
      constraintViolations.length,
      0,
      'did not return correct violations'
    );
  });

  it('returns correct pairing when grader is required by more subs than their workload', async function () {
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
    const requiredPairs = [
      {
        grader: 1,
        student: 1,
      },
      {
        grader: 1,
        student: 2,
      },
      {
        grader: 1,
        student: 3,
      },
    ];

    const opts = {
      students,
      graders,
      bannedPairs,
      requiredPairs,
      isDeterministic: true,
    };

    const expectedStudentToGrader = {
      1: 1,
      2: 1,
      3: 2,
      4: 2,
    };

    const expectedWorkloadMap = {
      1: 2,
      2: 2,
    };

    const expectedViolations = [{
      englishDescription: 'A different grader is required to grade this submission.',
      type: 'required',
      listOfStudentsInvolved: [3],
      listOfGradersInvolved: [1],
    }];

    // run the algorithm
    const {
      studentToGraderMap,
      workloadMap,
      constraintViolations,
    } = divvy(opts);

    // check if studentToGraderMap matches expected result
    Object.keys(studentToGraderMap).forEach((studentId) => {
      assert.equal(
        studentToGraderMap[studentId],
        expectedStudentToGrader[studentId],
        'did not return correct pairing in a group assignment'
      );
    });

    // check if workloadMap matches expected result
    Object.keys(workloadMap).forEach((graderId) => {
      assert.equal(
        workloadMap[graderId],
        expectedWorkloadMap[graderId],
        'did not return correct workload'
      );
    });

    // check if constraintViolations matches expected result
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

  it('returns correct pairing when grader has many friends', async function () {
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
    const bannedPairs = [
      {
        grader: 1,
        student: 1,
      },
      {
        grader: 1,
        student: 2,
      },
      {
        grader: 1,
        student: 3,
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
      isDeterministic: true,
    };

    const expectedStudentToGrader = {
      1: 2,
      2: 2,
      3: 1,
      4: 1,
    };

    const expectedWorkloadMap = {
      1: 2,
      2: 2,
    };

    const expectedViolations = [{
      englishDescription: 'This grader is banned from grading this submission.',
      type: 'banned',
      listOfStudentsInvolved: [3],
      listOfGradersInvolved: [1],
    }];

    // run the algorithm
    const {
      studentToGraderMap,
      workloadMap,
      constraintViolations,
    } = divvy(opts);

    // check if studentToGraderMap matches expected result
    Object.keys(studentToGraderMap).forEach((studentId) => {
      assert.equal(
        studentToGraderMap[studentId],
        expectedStudentToGrader[studentId],
        'did not return correct pairing in a group assignment'
      );
    });

    // check if workloadMap matches expected result
    Object.keys(workloadMap).forEach((graderId) => {
      assert.equal(
        workloadMap[graderId],
        expectedWorkloadMap[graderId],
        'did not return correct workload'
      );
    });

    // check if constraintViolations matches expected result
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

  it('returns correct pairing w/ more graders than students', async function () {
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
        proportionalWorkload: 1,
      }, {
        id: 2,
        proportionalWorkload: 1,
      },
      {
        id: 3,
        proportionalWorkload: 1,
      }, {
        id: 4,
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
      isDeterministic: true,
    };

    // running the algorithm
    const {
      workloadMap,
      constraintViolations,
    } = divvy(opts);

    // check that one and only one grader is not grading any students
    assert.equal(
      graders.length - Object.keys(workloadMap).length,
      1,
      'one and only one grader is not grading any student condition is not met'
    );

    // check if there are no constraint violations
    assert.equal(
      constraintViolations.length,
      0,
      'did not return correct violations'
    );
  });

  it('returns result when assigned students > workload', async function () {
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
      isDeterministic: true,
    };

    // running the algorithm, a random grader will get assigned 2 students
    const { studentToGraderMap, constraintViolations } = divvy(opts);

    // check that all student is assigned a grader
    assert.equal(
      Object.keys(studentToGraderMap).length,
      students.length,
      'not all students have been assigned'
    );

    // check if there are no constraint violations
    assert.equal(
      constraintViolations.length,
      0,
      'did not return correct violations'
    );
  });
});
