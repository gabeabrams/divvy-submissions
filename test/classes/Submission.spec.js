const assert = require('assert');
const Submission = require('../../classes/Submission');

describe('classes > Submission', function () {
  it('returns correct values for getter, setter function', async function () {
    // Create fake data
    const fakeStudentIds = [1, 3, 4];
    const fakeIsSubmitted = true;

    // Create new submission object
    const sub1 = new Submission(fakeStudentIds, fakeIsSubmitted);

    // Test getters
    assert(
      sub1.getStudentIds() === fakeStudentIds,
      'studentID getter not working'
    );
    assert(
      sub1.getIsSubmitted() === fakeIsSubmitted,
      'isSubmitted getter not working'
    );
    assert(sub1.getSubmissionId() === 1, 'static function not workin');

    // Test setters
    const newFakeStudentIds = [4, 2, 1];
    const newIsSubmitted = false;

    sub1.setStudentIds(newFakeStudentIds);
    sub1.setIsSubmitted(newIsSubmitted);

    assert(
      sub1.getStudentIds() === newFakeStudentIds,
      'studentId setter not working'
    );
    assert(
      sub1.getIsSubmitted() === newIsSubmitted,
      'isSubmitted setter not working'
    );

    // Test static Id creator
    const sub2 = new Submission(fakeStudentIds, fakeIsSubmitted);
    assert(sub2.getSubmissionId() === 2, 'static function not workin');
    const sub3 = new Submission(fakeStudentIds, fakeIsSubmitted);
    assert(sub3.getSubmissionId() === 3, 'static function not workin');
  });
});
