module.exports = (filter, type) => lic => {
  if (!lic || (!filter.length && !type.length)) {
    return true;
  }

  lic = lic.toLowerCase();
  filter = filter.map(lic => lic.toLowerCase());
  type = type.map(lic => lic.toLowerCase());

  if (filter.some(fil => lic.includes(fil))) {
    return true;
  }
  if (type.some(typ => typ === lic)) {
    return true;
  }
  return false;
}
