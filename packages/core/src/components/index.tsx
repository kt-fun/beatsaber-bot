import { renderToStaticMarkup } from 'react-dom/server'
import React from "react";

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
        <script src="https://cdn.tailwindcss.com"></script>
        <title>IMG Render</title>
      </head>
      <body className={'bg-transparent'}>{children}<style dangerouslySetInnerHTML={{ __html: styles }} /></body>

    </html>
  )
}

export const getHtml = (child: React.ReactNode) => {
  const res = renderToStaticMarkup(<App>{child}</App>)
  return ` <!DOCTYPE html>` + res
}
