/**
 * Randomly shuffle the order of elements within the given array
 * @param {object[]} array - the list of objects to shuffle
 * @return {object[]} - the list of objects after being randomly shuffled
 */
module.exports = (array) => {
  // Perform a shallow clone
  const arr = array.slice(0);

  // Run standard algorithm (Fisher–Yates shuffle)
  // Adapted from: https://bost.ocks.org/mike/shuffle/
  let currentIndex = arr.length;
  let temp;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temp;
  }

  return arr;
};
