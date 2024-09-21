// @ts-nocheck
import React from 'react'
import * as ReactDOMServer from 'react-dom/server'

function App({ children }: { children?: React.ReactNode }) {
  const styles = `
    .bs-bg-gradient {
      background: linear-gradient(to bottom right, rgba(180, 104, 104, 0.4), rgba(83, 113, 157, 0.4));
    }
    .gradient-border {
      --tw-border-width: 3px;
      --tw-border-radius: 10px;
      position: relative;
      box-sizing: border-box;
    }
      .gradient-border::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--tw-border-radius);
      padding: var(--tw-border-width);
      background: linear-gradient(70deg, #FE9393, #F57979, #417ED8);
      -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

`
  return (
    <html>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.7.2/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <title>IMG Render</title>
      </head>
      <body className={'bg-red-400 flex w-fit'}>{children}</body>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </html>
  )
}

export default App

export const renderComponent = (child: React.ReactNode) => {
  let res = ReactDOMServer.renderToString(<App>{child}</App>)
  res = ` <!DOCTYPE html>` + res
  return res
}

export const getHtml = renderComponent
//
// export const renderImg = async (
//   child: React.ReactNode,
//   onStart?: () => void,
//   onError?: () => void
// ) => {
//   let res = ReactDOMServer.renderToString(<App>{child}</App>)
//   res = ` <!DOCTYPE html>` + res
//
//   const buf = await render(res, async (page, next) => {
//     onStart?.()
//     await sleep(5000)
//     return page
//       .$('body')
//       .then(next)
//       .catch((e) => {
//         onError?.()
//         return ''
//       })
//   })
//   return buf
// }
