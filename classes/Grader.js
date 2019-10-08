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
  getNumToGrade() {
    return this.numToGrade;
  }

  // Setter for numToGrade
  setNumToGrade(newNumToGrade) {
    this.numToGrade = newNumToGrade;
  }

  // Getter for allowedSubmissions
  getAllowedSubmissions() {
    return this.allowedSubmissions;
  }

  // Getter for grader id
  getId() {
    return this.id;
  }
}

module.exports = Grader;
