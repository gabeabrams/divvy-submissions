const assert = require('assert');
const Grader = require('../../classes/Grader');

describe('classes > Grader', function () {
  it('returns correct values for getter, setter function', async function () {
    // Create dummy info
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
    const fakePropWorkload = 0.7;

    // Create grader instance to test
    const bob = new Grader(fakeGraderId, fakeSubmissionsArr, fakePropWorkload);

    // Test initialize numToGrade
    assert(bob.getNumToGrade() === -1, 'did not initialize numToGrade to -1');

    // Test initialize proportionalWorkload
    assert.equal(
      bob.getProportionalWorkload(),
      fakePropWorkload,
      'did not initialize proportionalWorkload'
    );

    // Test getAllowedSubmissions getter
    assert(
      bob.getAllowedSubmissions() === fakeSubmissionsArr,
      'getter function for submissions did not return correct value'
    );

    // Test getId getter
    assert(
      bob.getId() === fakeGraderId,
      'getter function for graderid did not return correct value'
    );

    // Testing set/get numToGrade
    const newNumToGrade = 8;
    bob.setNumToGrade(newNumToGrade);
    assert.equal(
      bob.getNumToGrade(),
      8,
      'setter function did not function correctly'
    );
  });
});
