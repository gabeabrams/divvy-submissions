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

  console.log('total wordload is ', totalWorkload);

  // number of submissions left to assign after initial distribution
  let numSubsLeft = numSubmissions;

  const firstDistributedSubs = Math.floor(numSubmissions / totalWorkload);

  // distribute number of submissions each grader will grade for sure
  graders.forEach((grader) => {
    // the number of submissions this grader grades
    const numToGrade = (
      // Math.floor(
      //   (grader.getProportionalWorkload() * numSubmissions) / totalWorkload
      // )
      firstDistributedSubs * grader.getProportionalWorkload()
    );

    grader.setNumToGrade(numToGrade);
    numSubsLeft -= numToGrade;
  });

  console.log('after first distribution the graders is ', graders);

  // If we have assigned every submission in first try, return
  if (numSubsLeft === 0) {
    return graders;
  }
  console.log('num subs left is ', numSubsLeft);

  // shuffle the list of graders using fisher-yates algorithm
  const randomGraders = shuffle(graders);

  console.log('random graders is ', randomGraders);

  // an array of values signifying the beginning and end of an interval, which
  // serves as visual representation of proportional workload. If a submission
  // lies in the interval [start, end), then we assign this submission to the
  // grader corresponding to this interval
  const intervals = [];

  // mapping between index, the start of each interval, and the grader
  // corresponding to that interval
  const indexToGraderMapping = {};

  let intervalSum = 0;
  intervals.push(intervalSum);

  randomGraders.forEach((grader) => {
    indexToGraderMapping[intervalSum] = grader;
    intervalSum += grader.getProportionalWorkload();
    intervals.push(intervalSum);
  });

  console.log('intervals is ', intervals);
  console.log('interval sum is ', intervalSum);
  // use this to create a representation of submissions left
  const proportion = intervalSum / (numSubsLeft + 1);
  let submissionNumber = proportion;

  console.log('proportion is ', proportion);
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
    console.log('index found is ', index);
    // find the corresponding grader
    const graderToAssign = indexToGraderMapping[intervals[index]];
    // increase by 1
    graderToAssign.setNumToGrade(graderToAssign.getNumToGrade() + 1);
    // decrease numSubsLeft by 1
    numSubsLeft -= 1;
    // increase submissionNumber by proportion
    submissionNumber += proportion;
  }
  console.log('random graders returned is ', randomGraders);
  return randomGraders;
};
