//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //    motto: 'Hello World',
    items: [],
    //loadingHidden: true,
    str: '',
    income: '-',
    expend: '-',
    totol: '-',
    date: '-',
    numclass: 'sign-green',
    nowdate:'',
  },
  addItem: function () {
    wx.navigateTo({
      url: '../item/item'
    })
  },
  // 使用onShow而不使用onLoad，使得添加返回后自刷新
  onShow: function () {
    // this.setData({
    //   //loadingHidden: false
    // });
    var that = this

    that.getList();
  },

  //
  onLoad: function () {
    // 初始化日期
    var dateStr = this.initDate();
    //    存回data，以渲染到页面
    this.setData({
      date: dateStr,
      nowdate: dateStr,
    })
  },
  initDate: function () {
    var date = new Date();
    //    格式化日期为"YYYY-mm-dd"

    var mouth = date.getMonth() + 1;
    if (mouth.toString().length < 2) {
      mouth = '0' + mouth;
    }
    var dateStr = date.getFullYear() + "-" + mouth;
    //    存回data，以渲染到页面
    return dateStr;
  },
  itemTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../item/item?id=' + id
    })
  },

  //获取账单列表
  getList: function(mouth) {
    var that = this;
    wx.showLoading();
    if (mouth == undefined){
      var dateStr = this.initDate();
    }else{
      var dateStr = mouth;
    }

    const db = wx.cloud.database();
    const _ = db.command;

    // 查询当前用户所有的 counters
    db.collection('test').where({
      _openid: that.data.openid,
      date: _.gte(dateStr + '-01').and(_.lte(dateStr + '-31')),
    }).orderBy('date', 'desc')
    .orderBy('created_at', 'desc')
    .get({
      success: res => {
        var str = '';
        var income = 0;
        var expand = 0;
        if (res.data.length == 0){
          str = '开始记录吧😄';
        }else{
          //计算统计数据
          for (var i = res.data.length - 1; i >= 0; i--) {
            if (res.data[i].cate == '+'){
              income += res.data[i].account * 100;
            }else{
              expand += res.data[i].account * 100;
            }
            
          }
        }

        var totol = income - expand

        if (income == 0){
          income = '-';
        }else{
          income = income/100;
        }

        if (expand == 0) {
          expand = '-';
        }else{
          expand = expand / 100;
        }

        
        var numclass = 'sign-red';
        if (totol < 0) {
          numclass = 'sign-green';
        }

        if (totol == 0){
          totol = '-';
        }else{
          totol = totol / 100;
        }
        
        that.setData({
          'items': res.data,
          //'loadingHidden': true,
          'str': str,
          'income': income,
          'expand': expand,
          'totol': totol,
          'numclass': numclass
        });
        wx.hideLoading();
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  
  //  点击日期组件确定事件
  bindDateChange: function (e) {
    this.getList(e.detail.value);
    this.setData({
      date: e.detail.value
    })
  },
})
