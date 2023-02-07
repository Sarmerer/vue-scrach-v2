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
    b.setBackgroundColor('lightblue').setInline().allowOutput()
  })

  Scratch.DeclareBlock('logic:operator', function (b) {
    b.addValueInput()
    b.addDummyInput().addSelectField({ value: 'and', options: ['and', 'or'] })
    b.addValueInput()
    b.setBackgroundColor('lightblue').setInline().allowOutput()
  })

  Scratch.DeclareBlock('logic:bool', function (b) {
    b.addDummyInput().addSelectField({
      value: 'true',
      options: ['true', 'false'],
    })
    b.setBackgroundColor('lightblue').allowOutput()
  })

  Scratch.DeclareBlock('logic:not', function (b) {
    b.addValueInput().addLabelField('not')
    b.setBackgroundColor('lightblue').allowOutput()
  })

  Scratch.DeclareBlock('loops:repeat-n-times', function (b) {
    b.addDummyInput()
      .addLabelField('repeat')
      .addNumberField({ value: 10 })
      .addLabelField('times')
    b.addStatementInput()
    b.setBackgroundColor('orange').setTextColor('black').allowPrev().allowNext()
  })

  Scratch.DeclareBlock('loops:for-each', function (b) {
    b.addValueInput()
      .addLabelField('for each')
      .addSelectField({ value: 'item', options: ['item'] })
      .addLabelField('in')
    b.addStatementInput()
    b.setBackgroundColor('orange').setTextColor('black').allowPrev().allowNext()
  })

  Scratch.DeclareBlock('loops:lifecycle', function (b) {
    b.addValueInput()
      .addSelectField({ value: 'break', options: ['break', 'continue'] })
      .addLabelField('loop')
    b.setBackgroundColor('orange').setTextColor('black').allowPrev()
  })

  Scratch.DeclareBlock('lists:from', function (b) {
    b.addValueInput().addLabelField('list with')
    b.addValueInput()
    b.setBackgroundColor('purple').allowOutput()
  })

  Scratch.DeclareBlock('text:string', function (b) {
    b.addDummyInput().addLabelField('"').addTextField().addLabelField('"')
    b.setBackgroundColor('cyan').setTextColor('black').allowOutput()
  })

  Scratch.DeclareBlock('text:print', function (b) {
    b.addValueInput().addLabelField('print')
    b.setBackgroundColor('cyan').setTextColor('black').allowNext().allowPrev()
  })

  Scratch.DeclareBlock('variable:existing', function (b) {
    b.addDummyInput().addSelectField({ value: 'a', options: ['a'] })
    b.setBackgroundColor('greenyellow').setTextColor('black').allowOutput()
  })
}

export default { register }
