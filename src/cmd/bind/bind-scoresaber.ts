import {Context, h, Session} from "koishi";
import {APIService} from "../../service";
import {getUserBSAccountInfo} from "../../service/db/db";
import {BSRelateOAuthAccount} from "../../index";


export const handleScoreSaberBind = async (ctx:Context,api:APIService,{session,options}:{session: Session<'id',never, Context>, options:{}}, input:string) => {
  const scoreSaberUser = await api.ScoreSaber
    .wrapperResult()
    .withRetry(3)
    .getScoreUserById(input)
  if(!scoreSaberUser.isSuccess()) {
    const text = session.text('commands.bsbot.bind.not-found', {id: input, platform:"ScoreSaber"})
    session.send(h('message', h('quote', {id: session.messageId}), text))
    return
  }
  const {ssAccount,blAccount} = await getUserBSAccountInfo(ctx, session.user.id)

  let text = session.text('commands.bsbot.bind.ack-prompt',{user: `${scoreSaberUser.data.name}(${scoreSaberUser.data.id})`})
    + (ssAccount ? ","+session.text('commands.bsbot.bind.exist',{id: ssAccount.platformUid }):"")
  session.sendQuote(text)

  const prompt = await session.prompt(30000)
  if(!prompt || prompt != 'y' && prompt != 'yes') {
    session.sendQuote(session.text(prompt?'commands.bsbot.bind.cancel':'commands.bsbot.bind.timeout'))
    return
  }
  let now = new Date()
  let account:Partial<BSRelateOAuthAccount> = {
    uid: session.user.id,
    platform: 'scoresaber',
    platformUid: scoreSaberUser.data.id,
    lastModifiedAt: now,
    lastRefreshAt: now,
    platformUname: scoreSaberUser.data.name,
    type: 'id',
  }
  if(!blAccount) {
    let account:Partial<BSRelateOAuthAccount> = {
      uid: session.user.id,
      platform: 'beatleader',
      platformUid: scoreSaberUser.data.id,
      lastModifiedAt: now,
      lastRefreshAt: now,
      platformUname: scoreSaberUser.data.name,
      type: 'id',
    }
    const res = await ctx.database.upsert('BSRelateOAuthAccount', [account])
  }
  if(ssAccount) {account.id = ssAccount.id}
  const res = await ctx.database.upsert('BSRelateOAuthAccount', [account])
  session.sendQuote(session.text('commands.bsbot.bind.success',{user: `${scoreSaberUser.data.name}(${scoreSaberUser.data.id})`}))
}


