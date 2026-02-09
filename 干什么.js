import plugin from '../../lib/plugins/plugin.js'
import { segment } from 'oicq'

export class example extends plugin {
  constructor () {
    super({
      name: 'only-at-bot',
      dsc: '仅单独@bot回复',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: '.*',   // 关键：必须能命中
          fnc: 'onlyAtBot'
        }
      ]
    })
  }

  async onlyAtBot (e) {
    
    if (!e.isGroup) return false

    // NapCat 下必须手动判断
    const atList = e.message.filter(m => m.type === 'at')

    // 必须且只能 @ 一个
    if (atList.length !== 1) return false

    // 必须 @ 的是 bot
    if (String(atList[0].qq) !== String(e.self_id)) return false

    // 除了 at 和空文本，不能有别的内容
    const hasOther = e.message.some(m => {
      if (m.type === 'at') return false
      if (m.type === 'text' && m.text.trim() === '') return false
      return true
    })
    if (hasOther) return false

    await e.reply(
      [
        segment.at(e.user_id),
        ' 干什么!!!'
      ],
      true
    )

    return true
  }
}
