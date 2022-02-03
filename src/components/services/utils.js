export function filterObject(object, props) {
  const filteredUser = Object.keys(object)
    .filter((key) => props.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});

  return filteredUser;
}
