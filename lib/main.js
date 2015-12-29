'use babel'

//import Path from 'path'
import {CompositeDisposable} from 'atom'
import protagonist from 'protagonist'
const minim = require('minim').namespace()
import {
  lineEndingsIndices,
  createResolution
}
from './helpers'

export default {
  subscriptions: new CompositeDisposable(),
  activate() {
      require('atom-package-deps').install();
      minim.use(require('minim-parse-result'));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'linter-api-blueprint:parse', this.parse))
    },
    deactivate() {
      this.subscriptions.dispose()
    },
    parse() {
      const workspace = atom.workspace
      const textEditor = workspace.getActiveTextEditor()
      const text = textEditor.getText()

      protagonist.parse(text, {
        generateSourceMap: false,
        type: 'refract'
      }, function(error, result) {

        workspace.open(null, {
          activatePane: true,
          split: 'right'
          }).then(function(editor) {
              serializedRefract = JSON.stringify(result, null, 2)
              editor.setText(serializedRefract)
              editor.setGrammar(atom.grammars.grammarForScopeName('source.json'))
            })
      })
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
                let endingIndices = lineEndingsIndices(text)
                resolutions.push(createResolution(endingIndices, filePath, annotation))
              })

              return resolve(resolutions)
            })
          })
        }
      }
    }
};
