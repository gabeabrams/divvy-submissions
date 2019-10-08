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
    // TODO: initialize the sub props
    this.id = getNextId();
    this.studentIds = []; // TODO: initialize this
    this.isSubmitted = false; // TODO: initialize this
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
