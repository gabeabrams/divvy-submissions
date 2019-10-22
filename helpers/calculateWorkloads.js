/**
 * Randomly shuffle the order of elements within the given array
 * @param {Graders[]} array - the list of graders who are grading
 * @return {Graders[]} - the list of graders after being randomly shuffled
 */
const shuffle = (array) => {
  const arr = array.slice(0);
  let currentIndex = arr.length;
  let temp;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
};

/**
 * Based on each grader's proportionalWorkload, determines each grader's number
 *   of submissions they have to grade and adds that number to the grader
 *   instances
 * @param {Grader[]} graders - the list of graders who are grading
 * @param {number} numSubmissions - the total number of submissions to grade
 */
module.exports = (graders, numSubmissions) => {
  // first under distribute all the submissions
  let totalWorkload = 0;
  // calculate total workload
  graders.forEach((grader) => {
    totalWorkload += grader.getProportionalWorkload();
  });

  // number of submissions left to assign after initial distribution
  let numSubsLeft = numSubmissions;

  // distribute number of submissions each grader will grade for sure
  graders.forEach((grader) => {
    // the number of submissions this grader grades
    const numToGrade = (
      Math.floor(
        (grader.getProportionalWorkload() * numSubmissions) / totalWorkload
      )
    );

    grader.setNumToGrade(numToGrade);
    numSubsLeft -= numToGrade;
  });

  // If we have assigned every submission in first try, return
  if (numSubsLeft === 0) {
    return graders;
  }

  // shuffle the list of graders using fisher-yates algorithm
  const randomGraders = shuffle(graders);

  // an array of values signifying the beginning and end of an interval, which
  // serves as visual representation of proportional workload. If a submission
  // lies in the interval [start, end), then we assign this submission to the
  // grader corresponding to this interval
  const intervals = [];

  // mapping between index, the start of each interval, and the grader
  // corresponding to that interval
  const indexToGraderMapping = {};

  let intervalSum = 0;
  randomGraders.forEach((grader) => {
    intervals.push(intervalSum);
    indexToGraderMapping[intervalSum] = grader;
    intervalSum += grader.getProportionalWorkload();
  });

  // use this to create a representation of submissions left
  const proportion = intervalSum / (numSubsLeft + 1);
  let submissionNumber = proportion;

  // assign submissions left to graders until they have been all assigned
  while (numSubsLeft > 0) {
    let index;
    for (let i = 0; i < intervals.length - 1; i++) {
      if (
        intervals[i] <= submissionNumber && intervals[i + 1] > submissionNumber
      ) {
        index = i;
        break;
      }
    }
    // find the corresponding grader
    const graderToAssign = indexToGraderMapping[index];
    // increase by 1
    graderToAssign.setNumToGrade(graderToAssign.getNumToGrade() + 1);
    // decrease numSubsLeft by 1
    numSubsLeft -= 1;
    // increase submissionNumber by proportion
    submissionNumber += proportion;
  }

  return randomGraders;
};
