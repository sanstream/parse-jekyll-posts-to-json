const fs = require('fs')
const yaml = require('yaml')
const ndjson = require('ndjson')
const chalk = require('chalk')

const [ouputFileName, inputDirectory ] = Array.from(process.argv).reverse()

const serialize = ndjson.serialize()

serialize.on('data', function(line) {
  // line is a line of stringified JSON with a newline delimiter at the end
  fs.writeFileSync(ouputFileName, line, { flag: 'a' }, err => {})
})
console.log(`Parsing directory...`)
fs.readdirSync(inputDirectory, 'utf-8').forEach(fileName => {
  const file = fs.readFileSync(inputDirectory + fileName,  'utf8')
  // deal with the yaml frontmatter and content separately
  const fileChunks = file.split('---\n')
  if (fileChunks.length === 3) {
    const yamlFrontmatter = yaml.parse(fileChunks[1])
    const content = fileChunks[2]

    serialize.write({
      ...yamlFrontmatter,
      content,
    })
  } else {
    console.log(chalk.red(`There is something off with '${fileName}'`))
  }
})
serialize.end()

console.log(chalk.green(`Output written to '${ouputFileName}'`))

