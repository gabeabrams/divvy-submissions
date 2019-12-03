const assert = require('assert');
const createSubmissions = require('../../helpers/createSubmissions');

describe('helpers > createSubmissions', function () {
  it('returns correct submissions for individual homeworks', async function () {
    // create fake data
    const fakeStudents = [
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
        isSubmitted: false,
      },
      {
        id: 4,
        isSubmitted: true,
      },
    ];

    const fakeGroup = [];

    const opts = {
      students: fakeStudents,
      groups: fakeGroup,
    };

    // spot check return submission object to make sure values are correct
    createSubmissions(opts).forEach((returnedSubmission, i) => {
      // check if studentIds are correct
      assert.equal(
        JSON.stringify(returnedSubmission.getStudentIds()),
        JSON.stringify([i + 1]),
        'did not create correct studentIds accroding to students passed in'
      );
      // check if isSubmitted is correct
      if (i === 2) {
        assert.equal(
          returnedSubmission.getIsSubmitted(),
          false,
          'did not create correct isSubmitted according to students passed in'
        );
      } else {
        assert.equal(
          returnedSubmission.getIsSubmitted(),
          true,
          'did not create correct isSubmitted according to students passed in'
        );
      }
    });
  });

  it('return correct submissions in group assignments', async function () {
    // create fake data
    const fakeStudents = [
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
        isSubmitted: false,
      },
      {
        id: 4,
        isSubmitted: true,
      },
      {
        id: 5,
        isSubmitted: false,
      },
      {
        id: 6,
        isSubmitted: false,
      },
    ];

    const fakeGroup = [
      [1, 2, 3],
      [4],
      [5, 6],
    ];

    const opts = {
      students: fakeStudents,
      groups: fakeGroup,
    };

    const res = createSubmissions(opts);
    assert.equal(res.length, 3, 'did not return correct number of submissions');

    // spot check return submission object to make sure values are correct
    assert.equal(
      JSON.stringify(res[0].getStudentIds()),
      JSON.stringify([1, 2, 3]),
      'did not create correct studentIds accroding to students passed in'
    );
    assert.equal(
      res[0].getIsSubmitted(),
      true,
      'did not create correct isSubmitted according to students passed in'
    );
    assert.equal(
      JSON.stringify(res[1].getStudentIds()),
      JSON.stringify([4]),
      'did not create correct studentIds accroding to students passed in'
    );
    assert.equal(
      res[1].getIsSubmitted(),
      true,
      'did not create correct isSubmitted according to students passed in'
    );
    assert.equal(
      JSON.stringify(res[2].getStudentIds()),
      JSON.stringify([5, 6]),
      'did not create correct studentIds accroding to students passed in'
    );
    assert.equal(
      res[2].getIsSubmitted(),
      false,
      'did not create correct isSubmitted according to students passed in'
    );
  });
});
