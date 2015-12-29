'use babel'

const minim = require('minim').namespace()

import {
  resolutionType,
  createResolution
}
from '../lib/helpers.js'

import AnnotationRefractFixture from './fixtures/annotation.refract.json'
import AnnotationResolutionFixture from './fixtures/annotation.resolution.json'

describe('API Blueprint linter helpers', () => {

  describe('Resolution type helper', () => {

    it('recognizes the warning source annotation class', () => {
      let type = resolutionType(minim.toElement(['warning']))
      expect(type).toEqual('Warning')
    })

    it('recognizes the error source annotation class', () => {
      let type = resolutionType(minim.toElement(['red', 'green', 'error']))
      expect(type).toEqual('Error')
    })
  })

  describe('Create resolution helper', () => {

    it('creates resolution from a warning annotation', () => {
      let annotation = minim.fromRefract(AnnotationRefractFixture)
      let resolution = createResolution('', annotation)
      expect(resolution).toEqual(AnnotationResolutionFixture)
    })

  })
})