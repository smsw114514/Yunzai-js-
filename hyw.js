import plugin from '../../lib/plugins/plugin.js'

const repliedUsers = new Set()

export class autoQuestionOnce extends plugin {
  constructor () {
    super({
      name: '问号只回复一次',
      dsc: '每个人发？只回复一次hyw',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^[?？]$/,
          fnc: 'replyOnce'
        }
      ]
    })
  }

  async replyOnce (e) {
    const uid = e.user_id

    // 已回复过，直接结束
    if (repliedUsers.has(uid)) {
      return false
    }

    repliedUsers.add(uid)
    await e.reply('hyw')
    return true
  }
}
