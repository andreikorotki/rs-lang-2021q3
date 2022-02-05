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
