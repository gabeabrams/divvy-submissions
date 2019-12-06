# divvy-submissions

A script that takes a list of graders and submissions, and divvies up the submissions among the graders while adhering to constraints.

## Quickstart

// TODO: a very short description and a couple examples
- Install very briefly
- Very rough description of what you can include + see Usage for more info
- Example 1: very very basic one (but full with import and everything)
- Example 2: varying workload
- You can ban certain graders, do other stuff, etc. see Usage section

## Usage

### Install and Import

Install `divvy-submissions` into your project:

```bash
npm install divvy-submissions --save
```

Import `divvy-submissions`:

```js
const divvy = require('divvy-submissions');

// or with es6 imports:

import divvy from 'divvy-submissions';
```

### Arguments

| Name        | Type           | Description  | Required/Optional |
| :------------- | :------------- | :----- | :----- |
| students      | object[] | the full list of student entries in the form: { id, isSubmitted } | required|
| graders      | object[]      |  the full list of grader entries in the form: { id, proportionalWorkload } where proportionalWorkload is a number representing how many submissions this grader will grade compared with other graders. For example, with a proportionalWorkload of 1, they grade a normal amount. With a proportionalWorkload of 2, they grade double as much as others. With a proportionalWorkload of 0.7, they grade 70% as much as other graders. | required|
| bannedPairs | object[]     |    a list of pairs in the form { grader: <grader id>, student: <student id> } where in each pair, the specified grader is not allowed to grade the specified student | This is an optional argument. The default value is an empty array. |
| requiredPairs      | object[] | a list of pairs in the form { grader: <grader id>, student: <student id> } where in each pair, the specified grader must grade the specified student| This is an optional argument. The default value is an empty array.|
| groups      | number[][]    |   if the assignment is a group assignment, this is a list of id arrays where each id array represents the ids of students in a specific group | This is an optional argument. The default value is undefined. |
| isDeterministic | boolean |   if true, pairings won't be randomized, so you'll get the same results if you repeatedly run this algorithm | This is an optional argument. The default value is undefined so that the result will always be randomized|

### Interpreting Results

The algorithm will return three objects: studentToGraderMap shows which student is graded by which grader; workloadMap shows how many submissions each grader is assigned to grade; and constraintViolations is a list of constraints of banned/required pairs the algorithm broke while trying to assign each student to a grader. 


#### studentToGraderMap

studentToGraderMap { studentId => graderId } can be used to look up a student's assigned grader, or, with slight modification, to look up which student a grader is assigned to grade. <br />
An example of looking up the assigned grader for the student whose studentId is 1 is `studentToGradermap[1]`. <br />
An example of converting the map from a { studentId => graderId } format to a { graderId => studentId[] } format so that it's easier to look up the list of students a specific grader is assigned to grader is:

```js
let graderToStudentMap = {};
// Go through each student and add them under their assigned grader
Object.keys(studentToGraderMap).forEach((studentId)=> {
	// find the assinged graderId for this student
	const graderId = studentToGraderMap[studentId];
	// add this student into the array of students the grader is grading
	if (!graderToStudentMap) {
		graderToStudentMap[graderId] = [];
		graderToStudentMap[graderId].push(studentId);
	} else {
		graderToStudentMap[graderId].push(studentId);
	}
});
```

#### workloadMap

workloadMap { graderId => numToGrade } is for looking up how many submissions a grader has been assigned to grade. A submission is different than a student. In the case of group assignments, all the students in the same group will be in the same submission. It will be easier for them to all be graded by the same grader as there are similarities between their work. In the case of individual assignments, each submission will correspond to each individual student. If you are more interested in which students a specific grader has been assigned to grade, please refer to the example above that converts the studentToGraderMap. <br />

Workload is divvied up according to proportionalWorkload provided with each grader. For example, in the case where there are two graders: grader 1 has a proportionalWorkload of 1 and grader 2 has a proportionalWorkload of 2; 3 submission; and no banned/required pairs constraints: grader 1 will be randomly assinged one of the three submissions, while grader 2 will be assinged the other two. More complicated cases where submissions can't be evenly divided is explained in the "More on the algorithms" section at the end.

#### constraintViolations

Sometimes the algorithm has to break the banned/required pairs constraints in order to assign each submission to a grader. If this happens, we return an array of violation object in the following format to notice admins about these unavoidable violations.

```js
{
	englishDescription: <string description for user>,
	type: <'banned' or 'required'>,
	listOfStudentsInvolved: <array of student ids>,
	listOfGradersInvolved: <array of grader ids>,
 }
```

There are a totle of 3 different kinds of violations that can happen throughout the algorithm:

_Violation Type 1: A grader is grading a submission that is banned_

> We ask each grader to identify who is their friend in the list of students, so that we can hopefully assign them to someone else in order to avoid a conflict of interests. But this constraint doesn't always work out when a grader is friends with many students. 

_Violation Type 2: A grader is grading a submission that is required to be graded by another grader_

> In some cases, a grader is required to grade certain students. However, when the number of submissions this grader is required to grade exceeds their workload, the extra submissions will need to be graded by someone else, violating the required pairing constraint.

_Violation Type 3: Multiple graders are required to grade the same submission, impossible constraint_

> When more than one grader is required to grade the same submission, it is impossible to avoid a violation no matter who we assign this submission to. Since this kind of violations occured before the algorithm is even run, we decided to store them in a separate array and remove that student from all graders' required grading list so that it doesn't impact the result of the algorithm. We then return the union this pre-occured violations array and the violations that are generated through running the algorithm as constraintViolations.

## Examples

Intro: these are some helpful examples. 

### Example 1: _very simple case: all even graders, so no proportionalWorkload even included_

### Example 2: _divvy up with varying workload: double grader and someone who is sick and grading 75% the usual workload_

### Example 3: _required pairs_

### Example 4: _banned pairs_

### Example 5: _group assignment_

### Example 6: _want same student to grader map every time (deterministic)_

### Example 7: _all-in-one example with everything above_

## More on the Algorithm: How we Divvy Submissions

// TODO:
- how we use proportionalWorkload to approximately distribute workload
- how we are random in which grader(s) are given extra workload
- Secion on group assignments:
- if one student is banned, the whole submission for a group is banned
- if one student is required, the whole group is required
- the whole group submission counts as one thing to grade