import {Session} from "koishi";


export function SearchMsg(
{
  session,
  key
}:{
  session:Session,
  key: string
}
) {
  return (
    <message>
      <p>
        <at>{session.userId}</at>
        {session.text('')}:{key}
      </p>
    </message>
  )
}
