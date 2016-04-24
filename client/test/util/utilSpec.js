import { expect } from 'chai'
import { spy } from 'sinon'
import { getUserInventoryList, redirect, subscribeTo } from '../../util/util'
    
var stuff = spy(redirect("/testing"))

describe('Client: util/util.jsx', function () {
  it('function redirect should exist', function () {
    expect(redirect).to.exist;
  });

  it('function redirect should return a functin that hasn\'t been invoked', function () {
    expect(stuff.callCount).to.equal(0)
  });

  it('function redirect\'s result should throw a reference error on invocation due to lack of browser', function () {
    expect(stuff).to.throw(ReferenceError) //window not defined
  });

  it('function redirect\'s result should register that the function was invoked, despite the error', function () {
    expect(stuff.callCount).to.equal(1)
  });

  it('function subscribeTo should exist', function () {
    expect(subscribeTo).to.exist;
  });

  it('function getUserInventoryList should exist', function () {
    expect(getUserInventoryList).to.exist;
  });

  xit('function getUserInventoryList should make an AJAX request, transform objects, update state via actions dispatched to store', function () {
    expect(redirect).to.exist;
  });

});
