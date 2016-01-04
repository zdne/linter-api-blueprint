'use babel'

// Returns the type of an linter resolution from its classess array
function resolutionType(classes) {
  // console.log(`\nrefract classes:\n${JSON.stringify(classes,' ', 2)}`)
  //let classes = refractClasses.toValue()
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

      // TODO: Remove
      // console.log('\n r: ' + row + ' c: ' + column +'\n');

      return [row, column]
    }

    previousEndingIndex = endingsIndices[i]
  }

  return [row, column]
}

// Create range from a refract Source Map attribute (array of Source Map elements)
function resolutionRange(endingsIndices, sourceMapAttribute) {
  const DefaultRange = [[0,0], [0,1]]

  if (endingsIndices === undefined ||
      endingsIndices.length === 0) {
    // console.log('\nExit 0\n');
    return DefaultRange
  }

  // let sourceMap = sourceMapAttribute.toValue()
  if (sourceMapAttribute === undefined ||
      sourceMapAttribute.length === 0) {
    // console.log('\nExit 1\n');
    return DefaultRange
  }
  // console.log('\nsource map attribute:\n' + JSON.stringify(sourceMapAttribute.content, ' ', 2) + '\n')


  // Consider only first Source Map element
  let sourceMapElement = sourceMapAttribute[0]
  // console.log('\nsource map element:\n' + JSON.stringify(sourceMapElement.content, ' ', 2) + '\n')

  let indices = sourceMapElement.content
  // console.log('\nindices:\n' + JSON.stringify(indices, ' ', 2) + '\n')

  // TODO: Remove
  // console.log('\ntext buffer line endings:\n' + JSON.stringify(endingsIndices, ' ', 2) + '\n')


  var startIndex = 0
  var endIndex = 0

  if (indices === undefined ||
      indices.length === 0) {
    // console.log('\nExit 2\n');
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

  // TODO: Remove
  // console.log('\nstart index: ' + startIndex + ' end index: ' + endIndex + '\n')

  // console.log('\nExit 3\n');
  return [resolvePosition(endingsIndices, startIndex), resolvePosition(endingsIndices, endIndex)]
}

// Create Linter resolve value from Refract Source Annotation
function createResolution(endingsIndices, filePath, annotation) {
  // console.log(`\ninput element:\n${JSON.stringify(annotation, ' ', 2)}`);
  return {
    filePath,
    type: resolutionType(annotation.meta.classes),
    text: annotation.content,
    range: resolutionRange(endingsIndices, annotation.attributes.sourceMap)
  }
}

module.exports = {
  lineEndingsIndices,
  resolutionType,
  resolutionRange,
  createResolution
}
