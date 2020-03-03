# WeChat-Mini-Program-calendar
简易日历
逻辑思路：
  一、头部年月显示
    1.1 获取当年的年月日
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate()
  二、中间星期显示
    2.1 设置数组this.data.weekList = ['日', '一', '二', '三', '四', '五', '六']
  三、下面日期显示
    3.1 本页显示日期总数（上月剩余，本月，下月月初）
   *  3.1.1 currentMonthDays 计算出本月天数
   *  3.1.2 startWeek 计算出当月1号是周几
   *  3.1.3 currentMonthDays + startWeek 如果能被 7 整除
   *    totalDays = currentMonthDays + startWeek
   *  3.1.4 currentMonthDays + startWeek 如果不能被 7 整除
   *    totalDays = currentMonthDays + startWeek + (7 - (currentMonthDays + startWee) % 7)
   */
    3.1 上月日期
    3.2 当月日期
    3.3 下月日期
