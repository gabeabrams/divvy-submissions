/**
 * Randomly shuffle the order of elements within the given array
 * @param {Graders[]} array - the list of graders who are grading
 * @return {Graders[]} - the list of graders after being randomly shuffled
 */
const shuffle = (array) => {
  // Perform a shallow clone
  const arr = array.slice(0);

  // Run standard algorithm (Fisher–Yates shuffle)
  // Adapted from: https://bost.ocks.org/mike/shuffle/
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
 * @param {Grader[]} originalGraders - the list of graders who are grading
 * @param {number} numSubmissions - the total number of submissions to grade
 * @return {Grader[]} graders updated with their workloads (num grading)
 */
module.exports = (originalGraders, numSubmissions) => {
  // Clone the list of graders
  let graders = originalGraders.slice(0);

  /* --------- Step 1: Distribute Rounded Down Num of Subs -------- */

  // Number of submissions left to assign after initial distribution
  let numSubsLeft = numSubmissions;

  // calculate total workload
  let totalProportionalWorkload = 0;
  graders.forEach((grader) => {
    totalProportionalWorkload += grader.getProportionalWorkload();
  });
  console.log('total workload is ', totalProportionalWorkload);

  // Calculate students per proportional workload unit
  let studentsPerPropWorkloadUnit = (
    numSubmissions / totalProportionalWorkload
  );

  // // Rescale proportional workloads if there is more workload than subs
  // if (studentsPerPropWorkloadUnit < 1) {
  //   graders = graders.map((grader) => {
  //     // TODO: rescale the prop workloads so that studentsPerPropWorkloadUnit is greater than 1
  //     // (multiply them all by some large enough number -- numSubmissions?)
  //   });
  // }

  // distribute number of submissions each grader will grade for sure
  graders = graders.map((grader) => {
    // Get grader info
    const proportionalWorkload = grader.getProportionalWorkload();

    // Assign students to this grader
    const numToGrade = Math.floor(
      studentsPerPropWorkloadUnit * proportionalWorkload
    );
    grader.setNumToGrade(numToGrade);

    // Keep track of number of subs left
    numSubsLeft -= numToGrade;

    // Return the updated grader
    return grader;
  });

  console.log('after first distribution the graders is ', graders);

  // If we have assigned every submission in first try, return
  if (numSubsLeft === 0) {
    return graders;
  }
  console.log('num subs left is ', numSubsLeft);

  /* ---------------- Step 2: Assign Leftover Subs ---------------- */

  // shuffle the list of graders using fisher-yates algorithm
  const randomGraders = shuffle(graders);

  console.log('random graders is ', randomGraders);

  // Array of breakpoints in form { end, grader }
  // Where end is the proportional workload marker where the interval ends
  // and grader is the grader corresponding to the interval
  let intervalSum = 0;
  const breakpoints = randomGraders.map((grader) => {
    // Increment the running sum
    intervalSum += grader.getProportionalWorkload();

    // Create a breakpoint object
    return {
      grader,
      end: intervalSum,
    };
  });

  console.log('break point is ', breakpoints);

  /**
   * Look up grader corresponding to a number within interval
   * @param {number} submissionNumber - the number of the submission on the
   *   interval line
   * @return {Grader} the grader who is grading this submission
   */
  const calculateGrader = (submissionNumber) => {
    for (let i = 0; i < breakpoints.length; i++) {
      // Get info on current breakpoint
      const {
        grader,
        end,
      } = breakpoints[i];

      console.log('grader, end is ', grader, end);

      // Check if this breakpoint corresponds to the number given
      if (submissionNumber < end) {
        return grader;
      }
    }

    // An error occurred! We shouldn't have made it out of the loop
    throw new Error('Could not find the grader based on a submissionNumber');
  };

  // Divide the remaining submissions across the breakpoints:
  const subIntervalWidth = (intervalSum / (numSubsLeft + 1));

  console.log('subIntervalWidth is ', subIntervalWidth);

  // assign submissions left to graders until they have been all assigned
  let submissionNumber = subIntervalWidth;
  while (numSubsLeft > 0) {
    // find the corresponding grader
    const graderToAssign = calculateGrader(submissionNumber);

    console.log('graderToAssign is ', graderToAssign);

    // increase by 1
    graderToAssign.setNumToGrade(graderToAssign.getNumToGrade() + 1);
    // decrease numSubsLeft by 1
    numSubsLeft -= 1;
    // increase submissionNumber by subIntervalWidth
    submissionNumber += subIntervalWidth;
    console.log('submissio nnumber is ', submissionNumber);
  }

  console.log('random graders returned is ', randomGraders);
  return randomGraders;
};
