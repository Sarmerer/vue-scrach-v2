import { BlockInput } from './block-input'
import { Scratch } from './scratch'

export function register() {
  Scratch.DeclareBlock('function', function (b) {
    b.addDummyInput().addLabelField('function').addTextField({ value: 'add' })
    b.addStatementInput()
    b.setBackgroundColor('green')
  })

  Scratch.DeclareBlock('if', function (b) {
    b.addDummyInput().addLabelField('if').setAlign(BlockInput.Alignment.Right)
    b.addStatementInput()
    b.setBackgroundColor('lightblue')
      .setTextColor('black')
      .allowPrev()
      .allowNext()
  })

  Scratch.DeclareBlock('repeat', function (b) {
    b.addDummyInput()
      .addLabelField('repeat')
      .addNumberField({ value: 10 })
      .addLabelField('times')
    b.addStatementInput()
    b.setBackgroundColor('orange').allowPrev().allowNext()
  })

  Scratch.DeclareBlock('compare', function (b) {
    b.addValueInput()
    b.addDummyInput().addSelectField({
      value: '=',
      options: ['=', '!=', '<', '<=', '>', '>='],
    })
    b.addValueInput()
    b.setBackgroundColor('orange').setInline().allowOutput()
  })

  Scratch.DeclareBlock('latest', function (b) {
    b.addValueInput().addLabelField('not')
    b.setBackgroundColor('orange').allowOutput()
  })
}

export default { register }
