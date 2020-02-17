
import Transactions from '@/transactions'
import Records from '@/records'
import ManageCategories from '@/manage-categories'

const tabList = document.querySelectorAll('.tab')
const trasactionTab = document.querySelector('.transactions')
const recordTab = document.querySelector('.records')
const manageCategoriesTab = document.querySelector('.manage-categories')

function changeActiveTab (type) {
  tabList.forEach(tab => {
    const { currtab } = tab.dataset
    if (currtab === type) {
      trasactionTab.className = 'transactions'
      recordTab.className = 'records'
      manageCategoriesTab.className = 'manage-categories'
      tab.classList.add('active')
      if (type === 'TRANSACTIONS') {
        trasactionTab.classList.add('show-tabs')
      } else if (type === 'RECORDS') {
        recordTab.classList.add('show-tabs')
      } else {
        manageCategoriesTab.classList.add('show-tabs')
      }
    } else {
      tab.className = 'tab'
    }
  })
}

window.toggleActiveTab = (type) => changeActiveTab(type)

tabList[2].click()
