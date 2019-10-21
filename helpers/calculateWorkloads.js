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
    totalWorkload += grader.proportionalWorkload;
  });

  // distribute number of submissions each grader will grade for sure
  graders.forEach((grader) => {
    grader.setNumToGrade(
      Math.floor((grader.proportionalWorkload * numSubmissions) / totalWorkload)
    );
  });

  // then distribute all the left over submissions
  // shuffle the list of graders using fisher-yates algorithm
  const randomGraders = shuffle(graders);
};
