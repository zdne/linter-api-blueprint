'use babel'

// Returns the type of an linter resolution from refract classess
function resolutionType(refractClasses) {
  let classes = refractClasses.toValue()
  for (var i = 0; i < classes.length; i++) {
    if (classes[i] === 'warning') {
      return 'Warning'
    }
    else if (classes[i] === 'error') {
      return 'Error'
    }
  }
  return 'Info'
}

// Create range from a refract Source Map attribute (array of Source Map elements)
function resolutionRange(sourceMapAttribute) {
  let sourceMap = sourceMapAttribute.toValue()

  console.log('full map: ' + JSON.stringify(sourceMap, ' ', 2))

  var range = []
  // TODO: Implementation
  // sourceMap.forEach(function(sourceMapElement) {
  //   sourceMapElement.forEach(function(sourceBlock) {
  //     range.push(sourceBlock)
  //   })
  // })
  //
  // console.log('reduced map: '+ JSON.stringify(range, ' ', 2))
  return range
}

// Create Linter resolve value from Refract Source Annotation
function createResolution(textBuffer, filePath, annotation) {
  return {
    filePath,
    type: resolutionType(annotation.classes),
    text: annotation.toValue(),
    range: [[0,0], [0,1]] // TODO: processSourceMap(annotation)
  }
}

module.exports = {
  resolutionType,
  resolutionRange,
  createResolution
}
