const app = getApp()
import moment from '../../utils/common/moment.min'
Page({
  data: {
    weekList: [],
    monthList: [],
    year: '',
    month: '',
    day: ''
  },
  onLoad() {
    this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    this.monthDate(currentYear, currentMonth)
    this.setData(this.data)
  },
  // 获取当月的总天数
  getDayCountOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
  },
  // 获取当月的1号是周几
  getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
  },
  /**
   * 重点
   * 周一开头
   * startWeek = 6 - startWeek
   * 
   * 周日开头
   * 1、计算出本月日历共有多少数据（上月剩余，本月，下月月初）
   *  1.1 currentMonthDays 计算出本月天数
   *  1.2 startWeek 计算出当月1号是周几
   *  1.3 currentMonthDays + startWeek 如果能被 7 整除
   *    totalDays = currentMonthDays + startWeek
   *  1.4 currentMonthDays + startWeek 如果不能被 7 整除
   *    totalDays = currentMonthDays + startWeek + (7 - (currentMonthDays + startWee) % 7)
   */
  monthDate(year, month) {

    const currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth(),
    currentDate = new Date().getDate()

    const currentMonthDays = this.getDayCountOfMonth(year, month),
      startWeek = this.getFirstDayOfMonth(year, month),
      lastMonthDay = new Date(year, month, 0).getDate(),
      totalDays = (currentMonthDays + startWeek) % 7 === 0 ? 
      (currentMonthDays + startWeek) : 
      currentMonthDays + startWeek + (7 - (currentMonthDays + startWeek) % 7)

    let lastMonthDaysList = [],
      currentMonthDaysList = [],
      nextMonthDaysList = []
    for (let i = 0; i < totalDays; i++) {
      const add = {
        year: year,
        month: month
      }
      if (i < startWeek) {
        add.day = lastMonthDay - startWeek + 1 + i
        lastMonthDaysList.push(add)
      } else if (i < (startWeek + currentMonthDays)) {
        add.day = i + 1 - startWeek
        if (currentYear === year && currentMonth === month && currentDate === i + 1 - startWeek) {
          add.today = true
        }
        currentMonthDaysList.push(add)
      } else {
        add.day = i + 1 - (startWeek + currentMonthDays)
        nextMonthDaysList.push(add)
      }
    }
    wx.setNavigationBarTitle({
      title: `${year}年${month + 1}月`,
    })
    this.data.monthList = [...lastMonthDaysList, ...currentMonthDaysList, ...nextMonthDaysList]
    this.data.year = year
    this.data.month = month
    this.setData(this.data)
  },
  /**
   * 一、上个月
   *  1.1 month - 1
   *  1.2 如果 month == 0 那么 year - 1 month = 11
   * 二、下个月
   *  2.1 month + 1
   *  2.2 如果 month == 11 那么 year + 1 month = 0
   */
  changeMonth(e) {
    let { year, month } = this.data
    const { type } = e.currentTarget.dataset
    if ( type === 'prev') {
      if (month === 0) {
        year--
        month = 11
      } else {
        month--
      }
    } else {
      if (month === 11) {
        year++
        month = 0
      } else {
        month++
      }
    }
    this.monthDate(year, month)
  },
  bindDateChange(e) {
    const dateArr = e.detail.value.split('-')
    let year = +dateArr[0]
    let month = +dateArr[1] - 1
    this.monthDate(year, month)
  },
  clickDay(e) {
    console.log(e.currentTarget.dataset.item)
  }
})