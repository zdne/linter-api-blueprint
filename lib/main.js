'use babel'

//import Path from 'path'
import protagonist from 'protagonist'
const minim = require('minim').namespace()
import {
  createResolution
}
from './helpers'

export default {
  activate() {
      require('atom-package-deps').install();
      minim.use(require('minim-parse-result'));
    },
    provideLinter() {
      return {
        name: 'API Blueprint',
        grammarScopes: ['source.apib', 'source.mson', 'text.html.markdown.source.gfm.apib', 'text.html.markdown.source.gfm.mson'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {

          const text = textEditor.getText()
          if (text.length === 0) {
            return Promise.resolve([])
          }

          const filePath = textEditor.getPath()

          return new Promise(function(resolve, reject) {
            protagonist.parse(text, {
              generateSourceMap: false,
              type: 'refract'
            }, function(error, result) {

              var parseResult = minim.fromRefract(result)
              var resolutions = []
              parseResult.annotations.forEach(function(annotation) {
                resolutions.push(createResolution(filePath, annotation))
              })

              return resolve(resolutions)
            });
          })
        }
      }
    }
};
