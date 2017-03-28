interface Iparams {
  nextId: () => number
  hasExpired: (id: number) => boolean
}

const expirablePromiseProvider = (
  { nextId, hasExpired }: Iparams = idProvider(),
) => (promise: Promise<any>, id = nextId()) => promise.then(
(value) => {
  throwIfExpired(hasExpired, id)
  return value
},
(error) => {
  throwIfExpired(hasExpired, id)
  throw error
})

const throwIfExpired = (hasExpired: (id: number) => boolean, id: number) => {
  if ( hasExpired(id) ) {
    throw { expired: true, id, message: "expired"}
  }
}

const idProvider = (lastResolvedId = 0, idIterator = idGenerator()) => ({
  hasExpired: (id: number) => id < lastResolvedId
    ? true
    : (lastResolvedId = id, false),
  nextId: () => idIterator.next().value,
})

function* idGenerator(id = 0) { while (true) { yield ++id }}

export {
  expirablePromiseProvider,
  expirablePromiseProvider as default
}
