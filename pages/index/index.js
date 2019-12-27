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
    const currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth(),
    currentDate = new Date().getDate()
    this.setData({
      year: currentYear,
      month: currentMonth,
      day: currentDate
    })
    this.monthDate(currentYear, currentMonth)
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
      const add = {}
      if (i < startWeek) {
        const {year: year1, month: month1} = this.returnMonth('prev')
        add.year = year1
        add.month = month1
        add.day = lastMonthDay - startWeek + 1 + i
        lastMonthDaysList.push(add)
      } else if (i < (startWeek + currentMonthDays)) {
        add.year = year
        add.month = month
        add.day = i + 1 - startWeek
        if (currentYear === year && currentMonth === month && currentDate === add.day) {
          add.today = true
        }
        currentMonthDaysList.push(add)
      } else {
        const { year: year2, month: month2 } = this.returnMonth('next')
        add.year = year2
        add.month = month2
        add.day = i + 1 - (startWeek + currentMonthDays)
        nextMonthDaysList.push(add)
      }
    }
    wx.setNavigationBarTitle({
      title: `${year}年${month + 1}月`,
    })
    this.data.monthList = [...lastMonthDaysList, ...currentMonthDaysList, ...nextMonthDaysList]
    // this.data.year = year
    // this.data.month = month
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
  /**
   * 
   */
  changeMonth(e) {
    const { type } = e.currentTarget.dataset
    const { year, month } = this.returnMonth(type)
    this.data.year = year
    this.data.month = month
    this.setData(this.data)
    this.monthDate(year, month)
  },
  returnMonth(type) {
    let { year, month } = this.data
    if (type === 'prev') {
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
    return {year, month}
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