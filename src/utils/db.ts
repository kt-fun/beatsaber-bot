import {$, Context} from "koishi";


export async function getUserBSAccountInfo(ctx:Context, userid: number) {
  const accounts = await ctx.database.get('BSRelateOAuthAccount', (row)=> {
    return $.and(
      $.eq(row.uid, userid),
      $.or(
        $.eq(row.platform, 'scoresaber'),
        $.eq(row.platform, 'beatleader'),
      )
    )
  })
  const blAccount = accounts.find(it=> it.platform == 'beatleader')
  const ssAccount = accounts.find(it=> it.platform == 'scoresaber')
  const bsAccount = accounts.find(it=> it.platform == 'beatsaver')
  return {
    blAccount: blAccount,
    ssAccount,
    bsAccount,
  }
}
