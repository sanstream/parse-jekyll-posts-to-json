const fs = require('fs')
const yaml = require('yaml')
const ndjson = require('ndjson')
const chalk = require('chalk')

const [ouputFileName, category, inputDirectory ] = Array.from(process.argv).reverse()

const serialize = ndjson.serialize()

serialize.on('data', function(line) {
  // line is a line of stringified JSON with a newline delimiter at the end
  fs.writeFileSync(ouputFileName, line, { flag: 'a' }, err => {})
})
console.log(`Parsing directory...`)
fs.readdirSync(inputDirectory, 'utf-8').forEach(fileName => {
  const file = fs.readFileSync(inputDirectory + '/' + fileName,  'utf8')
  // deal with the yaml frontmatter and content separately
  const fileChunks = file.split('---\n')
  if (fileChunks.length === 3) {
    const yamlFrontmatter = yaml.parse(fileChunks[1])
    const content = fileChunks[2]
    const _id = fileName
    const _type = 'post'
    serialize.write({
      // Map data to sanity's post fields:
      title: yamlFrontmatter.title,
      categories: [ category, ],
      pusblishedAt: `${fileName.match(/^\d{4}-\d{2}-\d{2}/)}T00:00:00Z`,
      slug: `${category ? `${category}/` : ''}${fileName.split('.')[0]}`,
      content,
    })
  } else {
    console.log(chalk.red(`There is something off with '${fileName}'`))
  }
})
serialize.end()

console.log(chalk.green(`Output written to '${ouputFileName}'`))

