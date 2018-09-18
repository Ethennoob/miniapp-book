//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //    motto: 'Hello World',
    items: [],
    loadingHidden: true,
    str: ''
  },
  addItem: function () {
    wx.navigateTo({
      url: '../item/item'
    })
  },
  // 使用onShow而不使用onLoad，使得添加返回后自刷新
  onShow: function () {
    this.setData({
      loadingHidden: false
    });
    var that = this

    that.getList();
  },
  itemTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../item/item?id=' + id
    })
  },
  getList: function() {
    var that = this;
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('test').where({
      _openid: that.data.openid
    }).orderBy('created_at', 'desc')
    .get({
      success: res => {
        var str = '';
        if (res.data.length == 0){
          str = '开始记录吧😄';
        }
        that.setData({
          'items': res.data,
          'loadingHidden': true,
          'str': str
        });
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
  }
})
