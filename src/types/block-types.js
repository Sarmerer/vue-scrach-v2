import { BlockInput } from './block-input'
import { Scratch } from './scratch'

export function register() {
  Scratch.DeclareBlock('functions:return', function (b) {
    b.addDummyInput().addLabelField('function').addTextField({ value: 'add' })
    b.addStatementInput()
    b.addValueInput().addLabelField('return')
    b.setBackgroundColor('green')
  })

  Scratch.DeclareBlock('functions:no-return', function (b) {
    b.addDummyInput().addLabelField('function').addTextField({ value: 'add' })
    b.addStatementInput()
    b.setBackgroundColor('green')
  })

  Scratch.DeclareBlock('logic:if', function (b) {
    b.addValueInput().addLabelField('if').setAlign(BlockInput.Alignment.Right)
    b.addStatementInput()
    b.setBackgroundColor('lightblue')
      .setTextColor('black')
      .allowPrev()
      .allowNext()
  })

  Scratch.DeclareBlock('logic:compare', function (b) {
    b.addValueInput()
    b.addDummyInput().addSelectField({
      value: '=',
      options: ['=', '!=', '<', '<=', '>', '>='],
    })
    b.addValueInput()
    b.setBackgroundColor('orange').setInline().allowOutput()
  })

  Scratch.DeclareBlock('logic:operator', function (b) {
    b.addValueInput()
    b.addDummyInput().addSelectField({ value: 'and', options: ['and', 'or'] })
    b.addValueInput()
    b.setBackgroundColor('orange').setInline().allowOutput()
  })

  Scratch.DeclareBlock('logic:bool', function (b) {
    b.addValueInput().addSelectField({
      value: 'true',
      options: ['true', 'false'],
    })
    b.setBackgroundColor('orange').allowOutput()
  })

  Scratch.DeclareBlock('logic:not', function (b) {
    b.addValueInput().addLabelField('not')
    b.setBackgroundColor('orange').allowOutput()
  })

  Scratch.DeclareBlock('loops:repeat-n-times', function (b) {
    b.addDummyInput()
      .addLabelField('repeat')
      .addNumberField({ value: 10 })
      .addLabelField('times')
    b.addStatementInput()
    b.setBackgroundColor('orange').allowPrev().allowNext()
  })

  Scratch.DeclareBlock('loops:for-each', function (b) {
    b.addValueInput()
      .addLabelField('for each')
      .addSelectField({ value: 'item', options: ['item'] })
      .addLabelField('in')
    b.addStatementInput()
    b.setBackgroundColor('orange').allowPrev().allowNext()
  })

  Scratch.DeclareBlock('loops:lifecycle', function (b) {
    b.addValueInput()
      .addSelectField({ value: 'break', options: ['break', 'continue'] })
      .addLabelField('loop')
    b.setBackgroundColor('orange').allowPrev()
  })

  Scratch.DeclareBlock('lists:from', function (b) {
    b.addValueInput().addLabelField('list with')
    b.addValueInput().addLabelField('______')
    b.setBackgroundColor('orange').allowOutput()
  })

  Scratch.DeclareBlock('text:string', function (b) {
    b.addValueInput().addLabelField('"').addTextField().addLabelField('"')
    b.setBackgroundColor('orange').allowOutput()
  })

  Scratch.DeclareBlock('text:print', function (b) {
    b.addValueInput().addLabelField('print')
    b.setBackgroundColor('orange').allowNext().allowPrev()
  })
}

export default { register }
