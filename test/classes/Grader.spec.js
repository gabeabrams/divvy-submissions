const assert = require('assert');
const Grader = require('../../classes/Grader');

describe('classes > Grader', function () {
  it('returns correct values for getter, setter function', async function () {
    const fakeSubmissionsArr = [
      {
        id: 2,
        studentIds: [3, 4, 5],
        isSubmitted: true,
      },
      {
        id: 5,
        studentIds: [9, 8, 7],
        isSubmitted: false,
      },
    ];

    const fakeGraderId = 12456;

    const bob = new Grader(fakeGraderId, fakeSubmissionsArr);
    assert(bob.getNumToGrade() === -1, 'did not initialize numToGrade to -1');
    assert(
      bob.getAllowedSubmissions() === fakeSubmissionsArr,
      'getter function for submissions did not return correct value'
    );
    assert(
      bob.getId() === fakeGraderId,
      'getter function for graderid did not return correct value'
    );
  });
});
