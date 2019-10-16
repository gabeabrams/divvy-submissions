const assert = require('assert');
const createSubmissions = require('../../helpers/createSubmissions');

describe('helpers > createSubmissions', function () {
  it.only('returns correct submissions for individual homeworks', async function () {
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

  });
});
