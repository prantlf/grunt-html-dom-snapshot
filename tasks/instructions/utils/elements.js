function checkError (result) {
  if (result) {
    const error = result.error
    if (error) {
      const exception = new Error(error.message)
      exception.name = error.error
      exception.data = error.data
      exception.stacktrace = error.stacktrace
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

function checkSingleElement (browser, selector) {
  return browser.$$(selector)
    .then(elements => {
      if (elements.length > 1) {
        throw new Error(`Multiple elements matched "${selector}".`)
      }
    })
}

module.exports = { findElement, checkSingleElement }
