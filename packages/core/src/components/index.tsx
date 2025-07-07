import * as ReactDOMServer from 'react-dom/server'
import React from "react";

function App({ children }: { children?: React.ReactNode }) {
  return (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>IMG Render</title>
      </head>
      <body className={'bg-transparent'}>{children}</body>
    </html>
  )
}

export const getHtml = (child: React.ReactNode) => {
  let res = ReactDOMServer.renderToString(<App>{child}</App>)
  res = ` <!DOCTYPE html>` + res
  return res
}
