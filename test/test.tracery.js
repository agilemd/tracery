var chai = require('chai')
chai.should()
chai.use(require('chai-interface'))

describe('tracery', function () {
  var tracery = require('../index')

  it('has interface', function () {
    tracery.should.be.a('function')
    tracery.Collection.should.be.a('function')
  })

  it('returns a predicate asserting that an object matches a structure defined by builtins', function () {
    var p = tracery({
      a: String,
      b: Number,
      c: Boolean,
      d: Function,
      e: Object,
      f: Array
    })

    var obj = {
      a: 'tofu',
      b: 108,
      c: true,
      d: function () {},
      e: {},
      f: []
    }

    p(obj).should.equal(true)

    var obj2 = {
      a: false,
      b: obj2,
      c: 12
    }

    p(obj2).should.equal(false)
  })

  it('can match properties by predicate', function () {
    var minLength10 = function (x) { return x.length >= 10 }
    var p = tracery({
      username: minLength10
    })

    p({username: '23423423423423423423'}).should.equal(true)

    p({username: '2342'}).should.equal(false)
  })

  it('can match properties by regex', function () {
    var isUpperCase = /^[A-Z]*$/
    var p = tracery({
      b: isUpperCase
    })

    p({
      b: 'BAR'
    }).should.equal(true)


    p({
      b: 'Bar'
    }).should.equal(false)

  })

  it('supports deep object literal structure definitions', function () {
    var p = tracery({
      name: {
        first: String,
        last: String
      },
      emails: {
        work: String,
        home: String,
        school: String
      }
    })

    var user = {
      name: {
        first: 'Betty',
        last: 'Dodson'
      },
      emails: {
        work: 'b.dodson@megacorp.com',
        home: 'butterflychica947@lol.com',
        school: 'bdodso4@stateu.edu'
      }
    }

    p(user).should.equal(true)


    var user2 = {
      name: {
        firstName: 'Betty',
        lastName: 'Dodson'
      },
      emails: {
        work: 'b.dodson@megacorp.com',
        school: 'bdodso4@stateu.edu'
      }
    }

    p(user2).should.equal(false)

  })

  it('supports asserting typed arrays', function () {

    var isArrOfStrs = tracery([String])
    var t = ['a', 'b', 'c']
    var f = ['a', 'b', 3]

    isArrOfStrs(t).should.equal(true)
    isArrOfStrs(f).should.equal(false)
  })

})