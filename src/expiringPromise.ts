interface Iparams {
  nextId: () => number
  hasExpired: (id: number) => boolean
}

const expiringPromiseProvider = (
  { nextId, hasExpired }: Iparams = idProvider(),
) => (promise: Promise<any>, id = nextId()) => promise.then( (value) =>
  hasExpired(id)
  ? Promise.reject({ expired: true, id})
  : value,
)

const idProvider = (lastId = 0, idIterator = idGenerator()) => ({
  hasExpired: (id: number) => id < lastId
    ? true
    : (lastId = id, false),
  nextId: () => idIterator.next().value,
})

function* idGenerator(id = 0) { while (true) { yield ++id }}

export {
  expiringPromiseProvider,
  expiringPromiseProvider as default
}
