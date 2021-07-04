import { transform } from "@babel/core";

const componentName = 'WhatsMyNumber'

const solution = `
import React, { useState, useEffect, useCallback } from 'react'

interface Props {
}

// component which shows a input for a number
function ${componentName}(props: Props): JSX.Element {
    const [value, setValue] = useState(0)
    const onChange = useCallback(event => setValue(Number(event.target.value)), [])
    useEffect(() => {
        onChange(event)
    }, [])
    return (
        <input type="number" value={value} onChange={onChange} />
    )
}
`
const codeToCompile = `
import ReactDOMServer from 'react-dom/server'
${solution}
ReactDOMServer.renderToStaticMarkup(<${componentName} />)
`

const options = {
    filename: 'file.tsx',
    "presets": ["@babel/react", "@babel/typescript", ["@babel/env", { "modules": 'commonjs' }]],

}
transform(codeToCompile, options, function(err, result) {
  if (err) {
      console.log(`Couldn't vibe: ${err.message}`)
      return
  }
  if (result) {
      const code = `${result.code}`
      console.log('code', code)
      const resultHtml = eval(code)
      console.log('resultHtml',resultHtml)
  }
});
