import * as fetchApi from '../../views/fetch-api'

const CATEGORY_URL = 'http://localhost:5001/categories/'

function updateDOM () {
  
}

fetchApi.getAllViaApi(CATEGORY_URL)
  .then(() => {
    updateDOM()
  })