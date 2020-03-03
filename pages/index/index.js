Page({
  data: {
    weekList: [], // 星期列表
    monthList: [], // 当前月列表
    year: '',
    month: '',
    showMonth: '', // month + 1
    clickDayData: {},
    during: false,
    firstDay: false,
    circular: true
  },
  /**
   * 一、头部年月显示
   *    1.1 获取当年的年月，并且设置给date
   * 二、中间星期显示
   *    2.1 设置数组this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
   * 三、下面日期显示
   */
  onLoad() {
    this.getCurrentYearMonth()
    this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
    this.setMonthDate()
  },
  /**
   * 获取当前年月
   */
  getCurrentYearMonth() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate()
    this.setDate(year, month, day)
  },
  /**
   * 设置当前年月
   */
  setDate(year, month, day) {
    this.data.year = year
    this.data.month = month
    this.data.showMonth = this.formatNumber(month + 1)
    this.setData(this.data)
  },
  /**
   * 对月份自动补0
   */
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  setFirstDayWeek(year, month) {
    let { firstDay, weekList} = this.data
    let startWeek = this.getFirstDayOfMonth(year, month)
    if (firstDay) {
      startWeek = startWeek === 0 ? startWeek = 6 : startWeek - 1
      weekList = ['一', '二', '三', '四', '五', '六', '日']
    } else {
      weekList = ['日', '一', '二', '三', '四', '五', '六']
    }
    this.setData({
      weekList
    })
    return startWeek
  },
  setBarTitle() {
    const { showMonth, year } = this.data
    wx.setNavigationBarTitle({
      title: `${year}年${showMonth}月`,
    })
  },
  // 先写思路
  // 一、点击的是19年12月，点击下一个月的时候没有了clickDay
  //   1.1 拿到以前的monthList 和 现在的 monthList对比如果点击的那天没有一样的直接，把现在的赋值给以前的
  //   1.2 如果有一样的就把现在的那一项的clickDay = true，其它的赋值为false
  setClickDay() {
    const { clickDayData, monthList } = this.data
    if (Object.keys(clickDayData).length === 0) return
    const { year, month, day } = this.data.clickDayData
    monthList.forEach(v => {
      v.clickDay = false
      if (v.year === year && v.month === month && v.day === day) v.clickDay = true
    })
    this.setData({
      monthList
    })
  },
  /**
   * 周一开头
   * startWeek = 6 - startWeek
   * 
   * 周日开头
   * 1、计算出本页日历共有多少数据（上月剩余，本月，下月月初）
   *  1.1 currentMonthDays 计算出本月天数
   *  1.2 startWeek 计算出当月1号是周几
   *  1.3 currentMonthDays + startWeek 如果能被 7 整除
   *    totalDays = currentMonthDays + startWeek
   *  1.4 currentMonthDays + startWeek 如果不能被 7 整除
   *    totalDays = currentMonthDays + startWeek + (7 - (currentMonthDays + startWee) % 7)
   */
  setMonthDate() {
    const {year,month} = this.data
    const currentYear = new Date().getFullYear(),
    currentMonth = new Date().getMonth(),
    currentDate = new Date().getDate(),
    currentMonthDays = this.getDayCountOfMonth(year, month),
    lastMonthDay = new Date(year, month, 0).getDate()
    const startWeek = this.setFirstDayWeek(year, month)
    const totalDays = (currentMonthDays + startWeek) % 7 === 0 ? 
    (currentMonthDays + startWeek) : 
    currentMonthDays + startWeek + (7 - (currentMonthDays + startWeek) % 7)

    let lastMonthDaysList = [],
      currentMonthDaysList = [],
      nextMonthDaysList = [];
    for (let i = 0; i < totalDays; i++) {
      const add = {}
      if (i < startWeek) {
        const {year, month} = this.setMonth('prev')
        add.year = year
        add.month = month
        add.day = lastMonthDay - startWeek + 1 + i
        if (this.data.during) add.day = ''
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
        const { year, month } = this.setMonth('next')
        add.year = year
        add.month = month
        add.day = i + 1 - (startWeek + currentMonthDays)
        if (this.data.during) add.day = ''
        add.currentMonth = 'next'
        nextMonthDaysList.push(add)
      }
    }
    const monthList = [...lastMonthDaysList, ...currentMonthDaysList, ...nextMonthDaysList]
    this.setData({
      monthList
    })
    this.setBarTitle()
    this.setClickDay(monthList)
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
   * 一、上个月
   *  1.1 month - 1
   *  1.2 如果 month == 0 那么 year - 1 month = 11
   * 二、下个月
   *  2.1 month + 1
   *  2.2 如果 month == 11 那么 year + 1 month = 0
   */
  changeMonth(e) {
    const { type } = e.currentTarget.dataset
    const { year, month } = this.setMonth(type)
    this.setDate(year, month)
    this.setMonthDate()
  },
  setMonth(type) {
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
    this.setMonthDate()
  },
  clickDay(e) {
    const { year, month, day, currentMonth } = e.currentTarget.dataset.item
    const { during } = this.data
    if (currentMonth !== 'current' && during) return
    this.data.monthList.forEach(v => {
      v.clickDay = false
      if (v.year === year && v.month === month && v.day === day) {
        v.clickDay = true
        this.data.clickDayData = v
      }
    })
    this.setData(this.data)
  },
  showDuring(e) {
    this.data.during = e.detail.value
    this.setData(this.data)
    this.setMonthDate()
  },
  /**
   * 第一天显示周一还是周日
   * 一、系统刚进来显示周一
   *    1.1 startWeek = this.getFirstDayOfMonth(year, month)
   *    1。2 year和month也应该是本年本月
   * 二、点击周一开始
   *    2.1 weekList = ['一', '二', '三', '四', '五', '六', '日']
   *    2.2 startWeek = startWeek === 0 ? startWeek = 6 : startWeek - 1
   * 三、点击周日开始
   *    3.1 weekList = ['日', '一', '二', '三', '四', '五', '六']
   *    3.2 startWeek = this.getFirstDayOfMonth(year, month)
   *    
   */
  changeFirstDay(e) {
    this.data.firstDay = e.detail.value
    this.setData(this.data)
    this.setMonthDate()
  },
  changeCircular(e) {
    this.data.circular = e.detail.value
    this.setData(this.data)
  },
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  // wxLogin(e) {
  //   console.log(e)
  // }
})