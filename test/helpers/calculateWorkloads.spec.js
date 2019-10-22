const assert = require('assert');
const Grader = require('../../classes/Grader');
const calculateWorkloads = require('../../helpers/calculateWorkloads');

describe('helpers > calculateWorkloads', function () {
  it('returns correct workloads for each grader', async function () {
    // just check the sum of the graders equal to total submissions, and they don't differ by too much
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 2),
      new Grader(2, [], 2),
      new Grader(3, [], 1),
    ];

    const fakeNumSubmissions = 8;

    calculateWorkloads(fakeGraders, fakeNumSubmissions);
  });
});
