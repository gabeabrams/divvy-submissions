class Grader {
  /**
   * Create a new Grader instance
   * @param {number} graderId - the id of the grader
   * @param {Submission[]} allowedSubmissions - the list of submissions this
   *   grader is allowed to grade
   */
  constructor(graderId, allowedSubmissions) {
    // TODO: initialize the sub props
    this.id = graderId;
    this.allowedSubmissions = allowedSubmissions;
    this.numToGrade = -1; // Initialize this later
  }

  // TODO: add getters and setters for numToGrade
  // TODO: add getter for allowedSubmissions and id
}

module.exports = Grader;
