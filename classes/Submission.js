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

  // Getter for studentIds
  getStudentIds() {
    return this.studentIds;
  }

  // Getter for isSubmitted
  getIsSubmitted() {
    return this.isSubmitted;
  }

  // Setter for studentIds
  setStudentIds(newStudentIds) {
    this.studentIds = newStudentIds;
  }

  // Setter for isSubmitted
  setIsSubmitted(newIsSubmitted) {
    this.isSubmitted = newIsSubmitted;
  }

  // Getter for submissionId
  getSubmissionId() {
    return this.id;
  }
}

/**
 * @return {number} the unique id for this submission,
 *    generated in increasing order
 */
Submission.getNextId = () => {
  // TODO: implement
  Submission.instanceCount = (
    Submission.instanceCount ? Submission.instanceCount + 1 : 1
  );
  return Submission.instanceCount;
};

module.exports = Submission;
