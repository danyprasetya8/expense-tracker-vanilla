async function getAllViaApi (BASE_URL) {
  const resp = await fetch(BASE_URL)
  const parsed = await resp.json()
  return parsed
}

module.exports.getAllViaApi = getAllViaApi

async function getOneViaApi (BASE_URL, id) {
  console.log(`${BASE_URL}${id}`)
  const resp = await fetch(`${BASE_URL}${id}`)
  const parsed = await resp.json()
  return parsed
}

module.exports.getOneViaApi = getOneViaApi

async function postViaApi (BASE_URL, obj) {
  const params = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj),
  }
  const resp = await fetch(BASE_URL, params)
  return resp
}

module.exports.postViaApi = postViaApi


async function deleteViaApi (BASE_URL, id) {
  const params = {
    method: 'DELETE'
  }
  const resp = await fetch(`${BASE_URL}${id}`, params)
  return resp
}

module.exports.deleteViaApi = deleteViaApi

async function updateViaApi (BASE_URL, obj) {
  const params = {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }
  const resp = await fetch(`${BASE_URL}${obj._id}`, params)
  return resp
}

module.exports.updateViaApi = updateViaApi
