'use babel'

const minim = require('minim').namespace()

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

// Helper fuction to create array of character counts per each line
function lineEndingsIndices(textBuffer)  {
  let index = 0
  var indices = []
  for (let ch of textBuffer) {
    if (ch === '\n') {  // API Blueprint uses only LFs for the time being
      indices.push(index)
    }
    index++
  }

  return indices;
}

// Resolve position of an index within the indices map
function resolvePosition(endingsIndices, index) {
  var row = 0
  var column = 0
  var previousEndingIndex = 0

  for (var i = 0; i < endingsIndices.length; i++) {
    if (index <= endingsIndices[i]) {
      row = i
      column = index - previousEndingIndex - 1
      console.log('\n r: ' + row + ' c: ' + column +'\n');
      return [row, column]
    }

    previousEndingIndex = endingsIndices[i]
  }

  return [row, column]
}

// Create range from a refract Source Map attribute (array of Source Map elements)
function resolutionRange(endingsIndices, sourceMapAttribute) {
  let sourceMap = sourceMapAttribute.toValue()
  const DefaultRange = [[0,0], [0,1]]

  if (sourceMap.length === 0) {
    return DefaultRange
  }

  // Consider only first Source Map element
  let sourceMapElement = minim.fromRefract(sourceMap[0])
  let indices = sourceMapElement.toValue()

  var startIndex = 0
  var endIndex = 0

  if (indices.length === 0) {
    return DefaultRange
  }
  else {
    startIndex = indices[0][0]
    if (indices.length === 1) {
      endIndex = indices[0][0] + indices[0][1] - 1
    }
    else {
      endIndex = indices[indices.length - 1][0] + indices[indices.length - 1][1] - 1
    }
  }

  console.log('\indices: ' + JSON.stringify(indices, ' ', 2) + '\n')
  console.log('\nstart index: ' + startIndex + ' end index: ' + endIndex + '\n')
  console.log('\nedings indices: ' + JSON.stringify(endingsIndices, ' ', 2) + '\n')

  return [resolvePosition(endingsIndices, startIndex), resolvePosition(endingsIndices, endIndex)]
}

// Create Linter resolve value from Refract Source Annotation
function createResolution(endingsIndices, filePath, annotation) {
  return {
    filePath,
    type: resolutionType(annotation.classes),
    text: annotation.toValue(),
    range: resolutionRange(endingsIndices, annotation)
  }
}

module.exports = {
  lineEndingsIndices,
  resolutionType,
  resolutionRange,
  createResolution
}
