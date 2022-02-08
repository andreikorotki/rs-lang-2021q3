/**
 * Function received originalObject and filter its properties
 * according to filteredKeys in input
 * @export
 * @param {*} originalObject
 * @param {*} filteredKeys
 * @return {*} new object with filtredKeys only
 */
export function filterObject(originalObject, filteredKeys) {
  const filteredObject = Object.keys(originalObject)
    .filter((key) => filteredKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = originalObject[key];
      return obj;
    }, {});

  return filteredObject;
}

export function getUniqueRandomIndexes(requiredUniqueCount, sourceArrayLength) {
  if (requiredUniqueCount >= sourceArrayLength) {
    throw new Error('requiredUniqueCount should be less then sourceArrayLength');
  }
  const randomIndexes = [];
  while (randomIndexes.length < requiredUniqueCount) {
    const randomIndex = Math.floor(Math.random() * sourceArrayLength);
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex);
    }
  }
  return randomIndexes;
}
