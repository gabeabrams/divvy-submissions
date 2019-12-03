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

// TODO: nice looking table with the following cols:
// - argument name
// - argument type
// - description of argument
// - required/default (write "Required" if it is a required arg or include the default value if it is optional)

### Interpreting Results

// TODO: big picture summary of results
// - The algorithm will return three objects: studentToGraderMap which tells you XXXX, workloadMap which ...., and constraintViolations

#### studentToGraderMap

// TODO: go into detail about structure of object, how to look up who is assigned to whom

// TODO: Example of reversing to find the student assigned to each grader: (map: graderId => studentId[])

#### workloadMap

// TODO: go into detail, reiterate that the workload will sum to the number of submissions, and workload is divvied up according to proportionalWorkload

#### constraintViolations

// TODO: explain the different types of violations and why they occur and how we handle them

_Violation Type 1: alkjsldfja_

> laskdjf
> lskdjfwe
> asldkjf

_Violation Type 2: alkjsldfja_

> laskdjf
> lskdjfwe
> asldkjf

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