import { expirablePromiseCreator } from "../src/expirablePromise"

// tslint:disable:only-arrow-functions
describe("expirablePromiseProvider", function() {
  it("should return fulfilled promise", function() {
    const expirablePromise = expirablePromiseCreator()
    const promise = Promise.resolve("successful")
    return expirablePromise(promise).should.become("successful")
  })
  it("should reject expired promise", function() {
    const expirablePromise = expirablePromiseCreator()
    const promise1 = new Promise( (resolve) => setTimeout(() => resolve()))
    const promise2 = Promise.resolve()
    const expiredPromise = expirablePromise(promise1)
    expirablePromise(promise2)
    return expiredPromise.should.be.rejectedWith(/expired/)
  })
  it("should pass error", function() {
    const expirablePromise = expirablePromiseCreator()
    const promise = Promise.reject({ message: "some error" })
    return expirablePromise(promise).should.be.rejectedWith(/some error/)
  })
  it("should ignore error if promise has expired", function() {
    const expirablePromise = expirablePromiseCreator()
    const promise = new Promise( (_, reject) => {
        setTimeout( () => reject(new Error("some error")) )
    })
    const expiredPromise = expirablePromise(promise)
    expirablePromise(Promise.resolve())
    return expiredPromise.should.be.rejectedWith(/expired/)
  })
})
