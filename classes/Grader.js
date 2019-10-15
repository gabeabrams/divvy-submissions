class Grader {
  /**
   * Create a new Grader instance
   * @param {number} graderId - the id of the grader
   * @param {Submission[]} allowedSubmissions - the list of submissions this
   *   grader is allowed to grade
   * @param {number} proportionalWorkload - proportionalWorkload is a number
   *   representing how many submissions this grader will grade compared with
   *   other graders. For example, with a proportionalWorkload of 1, they grade
   *   a normal amount. With a proportionalWorkload of 2, they grade double as
   *   much as others. With a proportionalWorkload of 0.7, they grade 70% as
   *   much as other graders.
   */
  constructor(graderId, allowedSubmissions, proportionalWorkload) {
    this.id = graderId;
    this.allowedSubmissions = allowedSubmissions;
    this.proportionalWorkload = proportionalWorkload;
    this.numToGrade = -1; // Initialize this later
  }

  /**
   * Get numToGrade
   * @return {number} the number of submissions this grader has to grade
   */
  getNumToGrade() {
    return this.numToGrade;
  }

  /**
   * Set numToGrade
   * @param {number} newNumToGrade - the new number of submissions this grader
   *   has to grade
   */
  setNumToGrade(newNumToGrade) {
    this.numToGrade = newNumToGrade;
  }

  /**
   * Get allowedSubmissions
   * @return {Submission[]} allowedSubmissions - the list of submissions this
   *   grader is allowed to grade
   */
  getAllowedSubmissions() {
    return this.allowedSubmissions;
  }

  /**
   * Get proportionalWorkload
   * @return {number} this grader's proportionalWorkload
   */
  getProportionalWorkload() {
    return this.proportionalWorkload;
  }

  /**
   * Get grader id
   * @return {number} this grader's id
   */
  getId() {
    return this.id;
  }
}

module.exports = Grader;
