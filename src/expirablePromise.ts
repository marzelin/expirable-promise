interface IexpirationServices {
  assignId: () => number
  rejectIfExpired: (id: number) => boolean
}

const expirablePromiseCreator =
  ({ assignId, rejectIfExpired }: IexpirationServices = expirationInspector()) =>
  (promise: Promise<any>, id = assignId()) =>
  promise.then(
    (value) => {
      rejectIfExpired(id)
      return value
    },
    (error) => {
      rejectIfExpired(id) // if promise has expired the underlying error will be omitted
      throw error
    },
  )

const expirationInspector = (lastResolvedId = 0, idIterator = idGenerator()) => ({
  assignId: () => idIterator.next().value,
  rejectIfExpired: (id: number) => {
    if (id < lastResolvedId) {
      throw { expired: true, id, message: "expired"}
    }
    lastResolvedId = id
    return false
  },
})

const idGenerator = (id = 0) => ({ next: () => ({ value: ++id }) })

export {
  expirablePromiseCreator,
  expirablePromiseCreator as default
}
