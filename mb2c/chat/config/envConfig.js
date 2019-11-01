// 配置
import config from '../../config.js'

let ENVIRONMENT_CONFIG = {}

// dev 开发: 232b9bc7c221f25576e3b80458fb812f     33cf593c09c9
// prd 生产: 708e73e559eb1c86b6573f72c47afbdc     0707c5f6792e


ENVIRONMENT_CONFIG = {
  appkey: config.chatAppkey,
  url: config.chatUrl
};
// 是否开启订阅服务
ENVIRONMENT_CONFIG.openSubscription = true

module.exports = ENVIRONMENT_CONFIG