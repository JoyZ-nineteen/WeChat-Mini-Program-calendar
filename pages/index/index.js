Page({
  data: {
    weekList: [],
    monthList: [],
    year: '',
    month: '',
    day: '',
    clickDayData: {},
    firstDay: false
  },
  /**
   * 一、头部年月显示
   *    1.1 获取当年年月日，并且设置给data
   * 二、中间星期显示
   *    2.1 设置数组this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
   * 三、下面日期显示
   */
  onLoad() {
    this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
    const year = new Date().getFullYear(),
    month = new Date().getMonth()
    this.setDate(year, month)
    this.setMonthDate(year, month)
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
  setMonthDate(year, month) {
    const currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth(),
    currentDate = new Date().getDate(),
    currentMonthDays = this.getDayCountOfMonth(year, month),
    lastMonthDay = new Date(year, month, 0).getDate()
    let startWeek = this.getFirstDayOfMonth(year, month)
    if (this.data.firstDay) {
      startWeek = startWeek === 0 ? startWeek = 6 : startWeek - 1
      this.data.weekList = ['一', '二', '三', '四', '五', '六', '日']
    } else {
      this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
    }

    const totalDays = (currentMonthDays + startWeek) % 7 === 0 ? 
    (currentMonthDays + startWeek) : 
    currentMonthDays + startWeek + (7 - (currentMonthDays + startWeek) % 7)

    let lastMonthDaysList = [],
      currentMonthDaysList = [],
      nextMonthDaysList = [];
    
    for (let i = 0; i < totalDays; i++) {
      const add = {}
      if (i < startWeek) {
        const {year, month} = this.returnMonth('prev')
        add.year = year
        add.month = month
        add.day = lastMonthDay - startWeek + 1 + i
        if (this.data.showCurrentDay) add.day = ''
        add.currentMonth = 'prev'
        lastMonthDaysList.push(add)
      } else if (i < (startWeek + currentMonthDays)) {
        add.year = year
        add.month = month
        add.day = i + 1 - startWeek
        add.currentMonth = 'current'
        if (currentYear === year && currentMonth === month && currentDate === add.day) {
          add.today = true
        }
        currentMonthDaysList.push(add)
      } else {
        const { year, month } = this.returnMonth('next')
        add.year = year
        add.month = month
        add.day = i + 1 - (startWeek + currentMonthDays)
        if (this.data.showCurrentDay) add.day = ''
        add.currentMonth = 'next'
        nextMonthDaysList.push(add)
      }
    }
    const { showMonth } = this.data
    wx.setNavigationBarTitle({
      title: `${year}年${showMonth}月`,
    })
    // this.data.monthList = [...lastMonthDaysList, ...currentMonthDaysList, ...nextMonthDaysList]

    // 先写思路
    // 一、点击的是19年12月，点击下一个月的时候没有了clickDay
    //   1.1 拿到以前的monthList 和 现在的 monthList对比如果点击的那天没有一样的直接，把现在的赋值给以前的
    //   1.2 如果有一样的就把现在的那一项的clickDay = true，其它的赋值为false
    const monthList = [...lastMonthDaysList, ...currentMonthDaysList, ...nextMonthDaysList]
    monthList.forEach(v => {
      v.clickDay = false
    })
    const { clickDayData } = this.data
    if (clickDayData) {
      const clickMonthList = monthList.find(v => v.year === clickDayData.year && v.month === clickDayData.month && v.day === clickDayData.day)
      if (clickMonthList) {
        clickMonthList.clickDay = true
      }
    }
    this.data.monthList = monthList
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
    this.setDate(year, month)
    this.setMonthDate(year, month)
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
    this.setDate(year, month)
    this.setMonthDate(year, month)
  },
  setDate(year, month, day) {
    this.data.year = year
    this.data.month = month
    this.data.showMonth = this.formatNumber(month + 1)
    this.setData(this.data)
  },
  clickDay(e) {
    const { year, month, day, currentMonth } = e.currentTarget.dataset.item
    const { monthList, showCurrentDay } = this.data
    if (currentMonth !== 'current' && showCurrentDay) return
    monthList.forEach(v => {
      v.clickDay = false
    })
    const currentDay = monthList.find(v => v.year === year && v.month === month && v.day === day)
    currentDay.clickDay = true
    console.log(currentDay)
    this.setData({
      monthList,
      clickDayData: currentDay
    })
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  changeShowDay(e) {
    this.data.showCurrentDay = e.detail.value
    this.setData(this.data)
    const { year, month } = this.data
    this.setMonthDate(year, month)
  },
  changeFirstDay(e) {
    this.data.firstDay = e.detail.value
    this.setData(this.data)
    const { year, month } = this.data
    this.setMonthDate(year, month)
  },
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
})