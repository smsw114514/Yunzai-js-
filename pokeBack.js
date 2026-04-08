import plugin from '../../lib/plugins/plugin.js'

const cdList = new Map()

export class PokeBack extends plugin {
  constructor() {
    super({
      name: '拍一拍回复',
      dsc: '被拍一拍时回复干什么并回戳3次',
      event: 'notice.group.poke', // 监听拍一拍事件
      priority: 500
    })
  }

  async accept() {
    // 校验：是否拍的是 Bot
    if (this.e.target_id !== this.e.self_id) return false

    const userId = this.e.user_id
    const now = Date.now()

    // 冷却检查 (60秒)
    if (cdList.has(userId) && (now - cdList.get(userId) < 60000)) return true
    cdList.set(userId, now)

    // 回复消息 (使用数组格式避免 Segment 未定义报错)
    await this.e.reply([{ type: 'at', qq: userId }, ' 有事直说，戳我干什么(＞﹏＜)~~'])

    //使用 pokeMember 回戳3次
    let count = 0
    const maxCount = 3 // 回戳次数上限
    
    const timer = setInterval(async () => {
      try {
        if (this.e.group && this.e.group.pokeMember) {
          await this.e.group.pokeMember(userId)
        } else {
          await global.Bot.pickGroup(this.e.group_id).pokeMember(userId)
        }
        
        count++
        if (count >= maxCount) {
          clearInterval(timer)
        }
      } catch (err) {
        clearInterval(timer)
        console.error('[拍一拍反击] 失败：', err.message)
      }
    }, 0) // 立即执行，连续回戳3次

    return true
  }
}
