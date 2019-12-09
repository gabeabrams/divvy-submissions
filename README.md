# divvy-submissions

A script that takes a list of graders and submissions, and divvies up the submissions among the graders while adhering to constraints.

## Quickstart

Install using `npm install divvy-submissions --save` into your npm project. Divvy's main purpose is to assign each student to a grader, and it is easily customizable under different assignment types and grading constraints. It works with both group assignments and individual assignments; it allows each grader to choose their own workload; it also takes into account that sometimes a grader is banned from grading a student due to conflict of interests, or required to grade a student for specific reasons. To learn more about how to customize divvy, please refer to the [Usage](#usage) section below.

Here's an example on how to import and use divvy after installing:

```js
// import divvy
const divvy = require('divvy-submissions');

// sample grader object array with different proportinalWorkload
const graders = [
	{
		id: 1,
		proportionalWorkload: 1,
	},
	{
		id: 2,
       proportionalWorkload: 2,
    },
];

// sample student object array
const students = [
	{
       id: 1,
       isSubmitted: true,
    },
    {
       id: 2,
       isSubmitted: true,
    },
    {
       id: 3,
       isSubmitted: true,
    },
];

// call the divvy function, which will assign each student
// to an assigned grader in a fair, random way
const res = divvy({ graders, students });

```

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

| Name  | Type  | Description| Required/Optional |
| :--- | :--- | :--- | :--- |
| students | `object[]` | the full list of student entries in the form: `{ id, isSubmitted }` | required|
| graders | `object[]` | the full list of grader entries in the form: `{ id, proportionalWorkload }` where proportionalWorkload is a number representing how many submissions this grader will grade compared with other graders. For example, with a proportionalWorkload of 1, they grade a normal amount. With a proportionalWorkload of 2, they grade double as much as others. With a proportionalWorkload of 0.7, they grade 70% as much as other graders. | required |
| bannedPairs | `object[]` | a list of pairs in the form `{ grader: <grader id>, student: <student id> }` where in each pair, the specified grader is not allowed to grade the specified student | This is an optional argument. The default value is an empty array. |
| requiredPairs | `object[]` | a list of pairs in the form `{ grader: <grader id>, student: <student id> }` where in each pair, the specified grader must grade the specified student| This is an optional argument. The default value is an empty array. |
| groups | `number[][]` | if the assignment is a group assignment, this is a list of id arrays where each id array represents the ids of students in a specific group | This is an optional argument. The default value is undefined. |

### Interpreting Results

The algorithm will return three objects: `studentToGraderMap` shows which student is graded by which grader; `workloadMap` shows how many submissions each grader is assigned to grade; and `constraintViolations` is a list of constraints of banned/required pairs the algorithm broke while trying to assign each student to a grader.

```js
const {
	studentToGraderMap,
	workloadMap,
	constraintViolations,
} = divvy(...);
```

#### studentToGraderMap

studentToGraderMap `{ studentId => graderId }` can be used to look up a student's assigned grader, or, with slight modification, to look up which student a grader is assigned to grade.

An example of looking up the assigned grader for the student whose studentId is 1 is `studentToGradermap[1]`.

An example of converting the map from a `{ studentId => graderId }` format to a `{ graderId => studentId[] }` format so that it's easier to look up the list of students a specific grader is assigned to grader is:

```js
let graderToStudentMap = {};

// Go through each student and add them under their assigned grader
Object.keys(studentToGraderMap).forEach((studentId)=> {
	// find the assinged graderId for this student
	const graderId = studentToGraderMap[studentId];
	// add this student into the array of students the grader is grading
	if (!graderToStudentMap) {
		graderToStudentMap[graderId] = [];
	}
	graderToStudentMap[graderId].push(studentId);
});
```

#### workloadMap

workloadMap `{ graderId => numToGrade }` is for looking up how many submissions a grader has been assigned to grade. A submission is different than a student. In the case of group assignments, all the students in the same group will be in the same submission. It will be easier for them to all be graded by the same grader as there are similarities between their work. In the case of individual assignments, each submission will correspond to each individual student. If you are more interested in which students a specific grader has been assigned to grade, please refer to the example above that converts the `studentToGraderMap`.

Workload is divvied up according to `proportionalWorkload` provided with each grader. For example, in the case where there are two graders: grader 1 has a proportionalWorkload of 1 and grader 2 has a `proportionalWorkload` of 2; 3 submission; and no banned/required pairs constraints: grader 1 will be randomly assinged one of the three submissions, while grader 2 will be assinged the other two. More complicated cases where submissions can't be evenly divided is explained in the [More on the algorithms](#more-on-the-algorithm-how-we-divvy-submissions) section at the end.

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

### Example 1: Varying Workloads

In this example, we have a double grader and someone who is sick and grading 75% the usual workload.

```js
// import divvy
const divvy = require('divvy-submissions');

const graders = [
	// regular grader
	{
		id: 1,
		proportionalWorkload: 1,
	},
	// double grader
	{
		id: 2,
       proportionalWorkload: 2,
    },
    // grader who is sick and grading 75% of the usual workload
    {
		id: 3,
       proportionalWorkload: 0.75,
    },
];

// sample student object array
const students = [
	{
       id: 1,
       isSubmitted: true,
    },
    {
       id: 2,
       isSubmitted: true,
    },
    {
       id: 3,
       isSubmitted: true,
    },
    {
       id: 4,
       isSubmitted: true,
    },
];

// call the divvy function
const res = divvy({graders, students});

```


### Example 2: Required Pairs

In this example, grader with id 1 is required to grade the submission that contains the student with id 2.

```js
// import divvy
const divvy = require('divvy-submissions');

// sample graders
const graders = [
	// regular grader
	{
		id: 1,
		proportionalWorkload: 1,
	},
	// double grader
	{
		id: 2,
       proportionalWorkload: 1,
    },
];

// sample students array
const students = [
	{
       id: 1,
       isSubmitted: true,
    },
    {
       id: 2,
       isSubmitted: true,
    },
];

// required pairings
const requiredPairs = [
	// grader with id 1 is required to grade the submission
	// that contains the student with id 2
	{
       grader: 1,
       student: 2,
    },
];

// call the divvy function
const res = divvy({graders, students, requiredPairs});

```

### Example 3: Banned Pair

In this example, grader with id 1 is banned to grade the submission that contains the student with id 2.

```js
// import divvy
const divvy = require('divvy-submissions');

// sample graders
const graders = [
	// regular grader
	{
		id: 1,
		proportionalWorkload: 1,
	},
	// double grader
	{
		id: 2,
       proportionalWorkload: 1,
    },
];

// sample students array
const students = [
	{
       id: 1,
       isSubmitted: true,
    },
    {
       id: 2,
       isSubmitted: true,
    },
];

// banned pairings
const bannedPairs = [
	// grader with id 1 is banned to grade the submission
	// that contains the student with id 2
	{
       grader: 1,
       student: 2,
    },
];

// call the divvy function
const res = divvy({graders, students});

```

### Example 4: Group Assignment

In this example, students submitted in groups.

```js
// import divvy
const divvy = require('divvy-submissions');

// sample graders
const graders = [
	// regular grader
	{
		id: 1,
		proportionalWorkload: 1,
	},
	// double grader
	{
		id: 2,
       proportionalWorkload: 1,
    },
];

// sample students array
const students = [
	{
       id: 1,
       isSubmitted: true,
    },
    {
       id: 2,
       isSubmitted: true,
    },
    {
       id: 3,
       isSubmitted: true,
    },
];

// This sample groups array specifies that student with id 1 is in a group,
// students with ids 2 and 3 are in another group together.
const groups = [[1], [2, 3]];

// call the divvy function
const res = divvy({graders, students, groups});

```

### Example 5: All-in-one (combination of everything above)


```js
// import divvy
const divvy = require('divvy-submissions');

// sample graders
const graders = [
	// regular grader
	{
		id: 1,
		proportionalWorkload: 1,
	},
	// double grader
	{
		id: 2,
       proportionalWorkload: 2,
    },
];

// sample students array
const students = [
	{
       id: 1,
       isSubmitted: true,
    },
    {
       id: 2,
       isSubmitted: true,
    },
    {
       id: 3,
       isSubmitted: true,
    },
    {
       id: 4,
       isSubmitted: true,
    },
    {
       id: 5,
       isSubmitted: true,
    },
    {
       id: 6,
       isSubmitted: true,
    },
];

// banned pairings
const bannedPairs = [
	{
       grader: 1,
       student: 2,
    },
    {
       grader: 1,
       student: 3,
    },
    {
       grader: 1,
       student: 4,
    },
];

// required pairings
const requiredPairs = [
	{
       grader: 1,
       student: 1,
    },
    {
       grader: 2,
       student: 2,
    },
    {
       grader: 2,
       student: 6,
    },
];

// call the divvy function
const res = divvy({
	graders,
	students,
	bannedPairs,
	requiredPairs,
});

/*
	The expected studentToGraderMap returned in this case is:
	{
		1: 1,
		2: 2,
		3: 2,
		4: 2,
		5: 1,
		6: 2,
	};

	The expected workloadMap returned is:
	{
		// grader 1 is grading 2 submissions, grader 2 is grading 4 submissions
	 	1: 2,
	 	2: 4,
	}

	The expected constraintViolations returned should be an empty array as
	this assignment doesn't violate any constraints
*/

```


## More on the Algorithm: How we Divvy Submissions

### How we approximately distribute workload randomly

First, we sum up all the proportional workload provided by the graders list. In order to acheive an evenly distributed workload, we follow the equation that the ratio between the proportional workload of a specific grader over the total proportional workload we summed up earlier equals to the actual number of submissions this grader should grader over the total number of submissions. With slight manipulation, the number of actual submissions a specific grader should grade is calculated by (total number of submissions/total amount of proportional workload) * proportional workload of that grader.

For example, assume we have 3 graders with proportional workload of 1, 2, and 2, and we have a total number of 6 submissions. First we sum up the total proportional workload, 5 in this case. The ratio of total number of submissions/total amount of proportional workload is a 6/5 = 1.2, which remains constant. For each grader, we multiply this ratio by their proportional workload. So in this case, we have grader 1 grading 1 * 1.2 = 1.2 submissions, grader 2 and 3 grading 2 * 1.2 = 2.4 submissions each. Because we can't split up a submission, we decided to floor each number, so grader 1 grades 1 sub, grader 2 and 3 grade 2 subs, and randomly distribute however many submissions left over.

After the initial distribution, we have 1 submission left over, which we need to randomly distribute to a grader. In order to take their proportional workload into account, we decided to represent each grader as an interval, with the length of the interval equaling to their proportional workload. In this case, the following graph represent the intervals:

<div style="text-align: center;">
|–––(length = 1)–––|––––––(length = 2)––––––|––––––(length = 2)––––––|
</div>

We then randomly generate a number between 0 and 5 so that this number will fall in one of the intervals. We then assign this submission to the grader corresponding to the interval that the number falls in.

### Group assignments

In group assignments, the whole group submission counts as one thing to grade because students within a group submit similar work. The ban/required pairing constraints also extends to group assignments. If a grader is banned or required to grade one student within a group, then the grader is banned/required to grade the whole submission.

## Thanks

### Financial Support

The first round of development for this project was generously funded by the Harvard Initiative for Learning and Teaching (HILT).

### Development

Thanks to [Henry Li](https://github.com/ShihanLi) for his work on the project.
