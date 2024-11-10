const path = require('path')
const {readFileSync} = require('fs')

const tmpl = readFileSync(path.resolve(__dirname, 'page.tmpl.html')).toString()

function page({levels}) {
  const levelsHtml = `<table border=1>
<tr><th>When</th><th>Value</th></tr>
${levels.map(({value, when}) => `<tr><td>${when.toLocaleString()}</td><td>${value}</td></tr>`).join('')}
</table>`
  return tmpl.replace('{{levels}}', levelsHtml)
}

module.exports = {page}
