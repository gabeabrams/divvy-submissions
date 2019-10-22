const assert = require('assert');
const Grader = require('../../classes/Grader');
const calculateWorkloads = require('../../helpers/calculateWorkloads');

describe('helpers > calculateWorkloads', function () {
  it.only('returns correct workloads when divides evenly', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 1),
      new Grader(2, [], 1),
      new Grader(3, [], 1),
    ];

    const fakeNumSubmissions = 6;

    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);
    res.forEach((grader) => {
      assert.equal(
        grader.getNumToGrade(),
        2,
        'did not assign correct number of submission to grade'
      );
    });
  });
});
