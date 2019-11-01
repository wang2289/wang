/**
 * 小程序配置文件
 */

// 小程序后台服务解决方案：https://www.qcloud.com/solution/la


// const apiUrl ='https://wx.xiniunet.com/router?
let environment = "pro";
//let environment = "test";

var config = {

    appId : 'wx9c30b5062851a1fd',
    apiUrl :  'https://api.xiniunet.com/router?',
    app_key :  'FEDA506D38D8E930626E850139E74E0C',
    secret :  '9019951CC31D86A31D2E911D4BE51142',
    tenantNumber :  '800961',
    tenantId :  '1038991752041734144',
    uploadFile :  'https://my.xiniunet.com/api/attachmentUpload.do',  //上传头像
    uploadFileone: 'https://my.xiniunet.com/api/fileUpload.do',   //评价上传图片
    webviewsrc : 'thefangtalk-x.xiniunet.com',   //首页
    webviewsrcone:  'thefangtalk-jf.xiniunet.com',   //积分商城
    storeId:"1059688126072623104",
    operatingUnitId: '1059362639714590720',
    fangliaoAppId: 'wxc50f9b13445a389a', //芳聊小程序AppID
    chatAppkey: '708e73e559eb1c86b6573f72c47afbdc',
    chatUrl: 'https://app.netease.im',
    mtaAppId:"500668641",
    mtaEventID:"500668646"

};


if (environment == "test"){  
  config.appId = 'wx878f29f4478f429d';    //测试
  config.apiUrl = 'https://api-test.xiniunet.com/router?';
  config.app_key = 'FEDA506D38D8E930626E850139E74E0C';
  config.secret = '9019951CC31D86A31D2E911D4BE51142';
  config.tenantNumber = '300029';
  config.tenantId = '852769418315444224';
  config.uploadFile = 'https://my-test.xiniunet.com/api/attachmentUpload.do';  //上传头像
  config.uploadFileone = 'https://my-test.xiniunet.com/api/fileUpload.do';   //评价上传图片
  config.webviewsrc ='ebusiness-mb2c-test.xiniunet.com';   //首页
  config.webviewsrcone = 'ebusiness-mb2c-test.xiniunet.com';   //积分商城
  config.chatAppkey = '708e73e559eb1c86b6573f72c47afbdc';
  config.chatUrl = 'https://app.netease.im';
  config.mtaAppId = 'https://app.netease.im';
  config.mtaEventID = 'https://app.netease.im';
  config.storeId="922019179513909248";
  config.operatingUnitId = '910123914666053632';
  config.mtaAppId = "500668641";
  config.mtaEventID = "500668646";

}else if (environment == "pre"){

    config.appId = 'wx48fa6a01358fdabe';     //生产
    config.apiUrl = 'https://api.xiniunet.com/router?';
    config.app_key = 'FEDA506D38D8E930626E850139E74E0C';
    config.secret = '9019951CC31D86A31D2E911D4BE51142';
    config.tenantNumber = '800088';
    config.tenantId = '801689539428098048';
    config.uploadFile = 'https://my.xiniunet.com/api/attachmentUpload.do';  //上传头像
    config.uploadFileone = 'https://my.xiniunet.com/api/fileUpload.do';   //评价上传图片
    config.webviewsrc = 'store-m.xiniunet.com';   //首页
    config.webviewsrcone = 'store-m.xiniunet.com';   //积分商城
    config.storeId = "803437220353679360";
    config.chatAppkey = '708e73e559eb1c86b6573f72c47afbdc',
    config.chatUrl = 'https://app.netease.im'
} else if (environment == "300029") {

  config.appId = 'wx48fa6a01358fdabe';     //生产
  config.apiUrl = 'https://api.xiniunet.com/router?';
  config.app_key = 'FEDA506D38D8E930626E850139E74E0C';
  config.secret = '9019951CC31D86A31D2E911D4BE51142';
  config.tenantNumber = '300029';
  config.tenantId = '852769418315444224';
  config.uploadFile = 'https://my.xiniunet.com/api/attachmentUpload.do';  //上传头像
  config.uploadFileone = 'https://my.xiniunet.com/api/fileUpload.do';   //评价上传图片
  config.webviewsrc = 'eBusiness-mb2c.xiniunet.com';   //首页
  config.webviewsrcone = 'eBusiness-mb2c.xiniunet.com';   //积分商城
  config.storeId = "1011508574037352448";
  config.chatAppkey = '708e73e559eb1c86b6573f72c47afbdc',
  config.chatUrl = 'https://app.netease.im'
}
module.exports = config;
