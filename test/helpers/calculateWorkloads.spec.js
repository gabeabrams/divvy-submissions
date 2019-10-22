const assert = require('assert');
const Grader = require('../../classes/Grader');
const calculateWorkloads = require('../../helpers/calculateWorkloads');

describe('helpers > calculateWorkloads', function () {
  it('returns correct workloads when divides evenly', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 1),
      new Grader(2, [], 1),
      new Grader(3, [], 1),
    ];

    const fakeNumSubmissions = 6;

    // call function
    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);

    // spot check if each grader gets assigned equal number of submissions
    res.forEach((grader) => {
      assert.equal(
        grader.getNumToGrade(),
        2,
        'did not assign correct number of submission to grade'
      );
    });
  });

  it('returns correct workloads when divides evenly 2', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 1),
      new Grader(2, [], 2),
      new Grader(3, [], 3),
    ];

    const fakeNumSubmissions = 6;

    // call function
    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);

    // spot check if each grader gets assigned equal number of submissions
    res.forEach((grader, i) => {
      assert.equal(
        grader.getNumToGrade(),
        i + 1,
        'did not assign correct number of submission to grade'
      );
    });
  });

  it('returns correct workloads if does not divide evenly', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 1),
      new Grader(2, [], 2),
      new Grader(3, [], 2),
    ];

    const fakeNumSubmissions = 6;

    // call function
    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);

    let subAssigned = 0;
    res.forEach((grader) => {
      subAssigned += grader.getNumToGrade();
    });

    // check if all submissions have been assigned
    assert.equal(
      subAssigned,
      fakeNumSubmissions,
      'did not assign every submission to grader'
    );
  });

  it.only('returns correct workload if does not divide evenly 2', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 1),
      new Grader(2, [], 2),
      new Grader(3, [], 2),
    ];

    const fakeNumSubmissions = 9;

    // call function
    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);

    let subAssigned = 0;
    res.forEach((grader) => {
      subAssigned += grader.getNumToGrade();
    });

    // check if all submissions have been assigned
    assert.equal(
      subAssigned,
      fakeNumSubmissions,
      'did not assign every submission to grader'
    );
  });

  it('returns correct workload if does not divide evenly 3', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 3),
      new Grader(2, [], 3),
      new Grader(3, [], 3),
    ];

    const fakeNumSubmissions = 2;

    // call function
    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);

    let subAssigned = 0;
    res.forEach((grader) => {
      subAssigned += grader.getNumToGrade();
    });

    // check if all submissions have been assigned
    assert.equal(
      subAssigned,
      fakeNumSubmissions,
      'did not assign every submission to grader'
    );
  });

  it('returns correct workload if does not divide evenly 3', async function () {
    // create fake data
    const fakeGraders = [
      new Grader(1, [], 3),
      new Grader(2, [], 3),
      new Grader(3, [], 4),
    ];

    const fakeNumSubmissions = 2;

    // call function
    const res = calculateWorkloads(fakeGraders, fakeNumSubmissions);

    let subAssigned = 0;
    res.forEach((grader) => {
      subAssigned += grader.getNumToGrade();
    });

    // check if all submissions have been assigned
    assert.equal(
      subAssigned,
      fakeNumSubmissions,
      'did not assign every submission to grader'
    );
  });
});
