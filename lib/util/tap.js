const tap = (v, fn) => {
  fn(v)
  return v
}

module.exports = tap