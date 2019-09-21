function checkError (result) {
  if (result) {
    const error = result.error
    if (error) {
      const exception = new Error(result.message)
      exception.name = error
      exception.data = result.data
      exception.stacktrace = result.stacktrace
      throw exception
    }
  }
}

function findElement (browser, selector) {
  return browser.$(selector)
    .then(element => {
      checkError(element)
      return element.elementId
    })
}

module.exports = { findElement }
