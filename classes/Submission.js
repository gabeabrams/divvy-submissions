class Submission {
  /**
   * Create a new Submission instance
   * @param {number[]} studentIds - the list of studentIds
   * @param {boolean} isSubmitted - whether the student or group submitted
   */
  constructor(studentIds, isSubmitted) {
    this.id = Submission.getNextId();
    this.studentIds = studentIds;
    this.isSubmitted = isSubmitted;
  }

  /**
   * Getter for studentIds
   * @return {number[]} studentIds - the list of studentIds
   */
  getStudentIds() {
    return this.studentIds;
  }

  /**
   * Getter for isSubmitted
   * @return {boolean} - whether the student or group submitted
   */
  getIsSubmitted() {
    return this.isSubmitted;
  }

  /**
   * Set studentIds
   * @param {number[]} studentIds - the new list of studentIds
   */
  setStudentIds(newStudentIds) {
    this.studentIds = newStudentIds;
  }

  /**
   * Set isSubmitted
   * @param {boolean} newIsSubmitted - if true, this has been submitted
   */
  setIsSubmitted(newIsSubmitted) {
    this.isSubmitted = newIsSubmitted;
  }

  /**
   * Get submissionId
   * @return {number} the submission id
   */
  getSubmissionId() {
    return this.id;
  }
}

/**
 * Generate a new unique submission id
 * @return {number} the unique id for this submission,
 *    generated in increasing order
 */
Submission.getNextId = () => {
  Submission.instanceCount = (
    Submission.instanceCount ? Submission.instanceCount + 1 : 1
  );
  return Submission.instanceCount;
};

module.exports = Submission;
