/**
 * // TODO: write JSDoc
 */
const getNextId = () => {
  // TODO: implement
};

class Submission {
  /**
   * // TODO: write inputs here
   */
  constructor(opts) {
    const { studentIds, isSubmitted } = opts;

    this.id = getNextId();
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

module.exports = Submission;
