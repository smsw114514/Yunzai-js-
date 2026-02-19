import plugin from '../../lib/plugins/plugin.js'

const cooldownMap = new Map()
const COOLDOWN = 5 * 60 * 1000 // 5 分钟

export class autoQuestionCooldown extends plugin {
  constructor () {
    super({
      name: '问号5分钟冷却',
      dsc: '同一用户5分钟内只回复一次hyw',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^[?|？]$/,
          fnc: 'replyWithCooldown'
        }
      ]
    })
  }

  async replyWithCooldown (e) {
    const key = e.user_id          // 只按人
    // const key = `${e.group_id}_${e.user_id}` // ← 按“群+人”冷却（更常见）

    const now = Date.now()
    const last = cooldownMap.get(key)

    if (last && now - last < COOLDOWN) {
      return false
    }

    cooldownMap.set(key, now)
    await e.reply('hyw')
    return true
  }
}

