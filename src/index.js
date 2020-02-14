
import Transactions from './js/transactions'
import Records from './js/records'

const tabList = document.querySelectorAll('.tab')
const trasactionTab = document.querySelector('.transactions')
const recordTab = document.querySelector('.records')

function changeActiveTab (type) {
  tabList.forEach(tab => {
    const { currtab } = tab.dataset
    if (currtab === type) {
      trasactionTab.className = 'transactions'
      recordTab.className = 'records'
      tab.classList.add('active')
      if (type === 'TRANSACTIONS') {
        trasactionTab.classList.add('show-tabs')
      } else {
        recordTab.classList.add('show-tabs')
      }
    } else {
      tab.className = 'tab'
    }
  })
}

window.toggleActiveTab = (type) => changeActiveTab(type)

tabList[1].click()
