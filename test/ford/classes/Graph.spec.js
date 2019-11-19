const assert = require('assert');
const Graph = require('../../../ford/classes/Graph');
const Grader = require('../../../classes/Grader');
const Submission = require('../../../classes/Submission');

describe('classes > Graph', function () {
  it('returns correct pairings', async function () {
    // create fake data
    const fakeSubmissions = [
      new Submission([1], true), // id: 1
      new Submission([2], true), // id: 2
      new Submission([3], true), // id: 3
      new Submission([4], true), // id: 4
    ];

    const allowedSubsGraderOne = [];
    const allowedSubsGraderTwo = [];
    // construct allowedSubs for each grader
    fakeSubmissions.forEach((sub, i) => {
      // only grader two is allowed to grade sub id: 3
      if (i + 1 === 3) {
        allowedSubsGraderTwo.push(sub);
      } else if (i + 1 === 4) {
        // only grader 1 is allowed to grade sub id: 4
        allowedSubsGraderOne.push(sub);
      } else {
        // both are allowed to grade sub id: 1 and id: 2
        allowedSubsGraderOne.push(sub);
        allowedSubsGraderTwo.push(sub);
      }
    });

    const fakeGraders = [
      new Grader(1, allowedSubsGraderOne, 1),
      new Grader(2, allowedSubsGraderTwo, 1),
    ];

    // set num to grade manually to 2 submissions per grader
    fakeGraders.forEach((grader) => {
      grader.setNumToGrade(2);
    });

    const graph = new Graph(fakeSubmissions, fakeGraders);
    const pairings = graph.solve();
    console.log('pairings is ', pairings);
  });

  it('returns correct pairings II', async function () {
    // create fake data
    const fakeSubmissions = [
      new Submission([1], true), // id: 1
    ];

    const fakeGraders = [
      new Grader(1, fakeSubmissions, 1),
      new Grader(2, fakeSubmissions, 1),
    ];

    // set num to grade manually to 1 submission per grader
    fakeGraders.forEach((grader) => {
      grader.setNumToGrade(1);
    });

    const graph = new Graph(fakeSubmissions, fakeGraders);
    const pairings = graph.solve();
    console.log('pairings are ', pairings);
  });

  it('return correct pairings when violation is unavoidable', async function () {
    // create fake data
    const fakeSubmissions = [
      new Submission([1], true), // id: 1
      new Submission([2], true), // id: 2
    ];

    const allowedSubsGraderOne = [];
    const allowedSubsGraderTwo = [];

    // set up allowedSubmissions such that neither allowed to grade submission 2
    allowedSubsGraderOne.push(fakeSubmissions[0]);
    allowedSubsGraderTwo.push(fakeSubmissions[0]);

    const fakeGraders = [
      new Grader(1, allowedSubsGraderOne, 1),
      new Grader(2, allowedSubsGraderTwo, 1),
    ];

    // set num to grade manually to 1 submissions per grader
    fakeGraders.forEach((grader) => {
      grader.setNumToGrade(1);
    });

    const graph = new Graph(fakeSubmissions, fakeGraders);
    const pairings = graph.solve();
  });
});
