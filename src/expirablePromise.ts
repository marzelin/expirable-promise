interface Iparams {
  nextId: () => number
  hasExpired: (id: number) => boolean
}

const expirablePromiseProvider = (
  { nextId, hasExpired }: Iparams = idProvider(),
) => (promise: Promise<any>, id = nextId()) => promise.then(
(value) =>
  hasExpired(id)
    ? Promise.reject({ expired: true, id, message: "expired"})
    : value,
(error) =>
  hasExpired(id)
    ? Promise.reject({ expired: true, id, message: "expired"})
    : Promise.reject(error),
)

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
