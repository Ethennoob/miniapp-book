// item.js
Page({
  data: {
    id: 0,
    title: '',
    cate: '+',
    account: '',
    modalHidden: true,
    alertHidden: true,
    date: ''
  },
  //   标题文本框
  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
    // console.log(e.detail.value)
  },
  //   金额radio
  radioChange: function (e) {
    this.setData({
      cate: e.detail.value
    })
    console.log(e.detail.value)
  },
  //   金额文本框  
  bindAccountInput: function (e) {
    this.setData({
      account: e.detail.value
    })
    // console.log(e.detail.value)
  },
  save: function () {
    var that = this
    if (this.data.title == '') {
      // 提示框
      that.setData({
        alertHidden: false,
        alertTitle: '标题不能为空'
      });
      return
    }

    var re = /^[0-9]+.?[0-9]*$/;
    if (!re.test(this.data.account)) {
      // 提示框
      that.setData({
        alertHidden: false,
        alertTitle: '金额只能是数字'
      });
      return
    }

    // 本条数据打包成json
    var record = {
      title: this.data.title,
      cate: this.data.cate,
      account: this.data.account,
      date: this.data.date
    }

    const db = wx.cloud.database()
    // 查询当前账本记录
    db.collection('test').add({
      data: record,
      success: res => {
        // 提示框
        that.setData({
          modalHidden: false,
          modalTitle: '添加成功'
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '添加失败'
        })
      }
    })
  },
  update: function () {
    var that = this;
    // 本条数据打包成json
    var record = {
      title: this.data.title,
      cate: this.data.cate,
      account: this.data.account,
      date: this.data.date
    }
    const db = wx.cloud.database()
    // 查询当前账本记录
    db.collection('test').doc(this.data.id).update({
      data: record,
      success: res => {
        // 提示框
        that.setData({
          modalTitle: '修改成功',
          modalHidden: false
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '修改失败'
        })
      }
    })
    
  },
  delete: function () {
    var that = this;
    const db = wx.cloud.database()
    // 查询当前账本记录
    db.collection('test').doc(this.data.id).remove({
      success: res => {
        // 提示框
        that.setData({
          modalTitle: '删除成功',
          modalHidden: false
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败'
        })
      }
    })
  },
  onLoad: function (options) {
    // 接收id值
    this.setData({
      id: options.id,
    })
    var that = this;
    if (options.id) {
      // 访问网络，读取账目
      that.getOne(options.id);
    }
    // 初始化日期
    //    获取当前日期
    var date = new Date();
    //    格式化日期为"YYYY-mm-dd"
    var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //    存回data，以渲染到页面
    this.setData({
      date: dateStr
    })
  },
  onReady: function () {
    // 标题栏
    if (this.data.id) {
      wx.setNavigationBarTitle({
        title: '修改账目'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加账目'
      })
    }
  },

  // 关闭添加成功对话框
  hideModal: function () {
    this.setData({
      'modalHidden': true
    })
    // 返回上一页
    wx.navigateBack()
  },
  // 关闭表单验证对话框
  hideAlertView: function () {
    this.setData({
      'alertHidden': true
    })
  },
  //  点击日期组件确定事件
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  getOne: function (id) {
    var that = this;
    const db = wx.cloud.database()
    // 查询当前账本记录
    db.collection('test').doc(id).get({
      success: res => {
        that.setData({
          id: res.data._id,
          title: res.data.title,
          cate: res.data.cate,
          account: res.data.account,
          date: res.data.date
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