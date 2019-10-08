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

  // Getter for numToGrade
  get numToGrade() {
    return this.numToGrade;
  }

  // Setter for numToGrade
  set numToGrade(newNumToGrade) {
    this.numToGrade = newNumToGrade;
  }

  // Getter for allowedSubmissions
  get allowedSubmissions() {
    return this.allowedSubmissions;
  }

  // Getter for grader id
  get id() {
    return this.id;
  }
}

module.exports = Grader;
