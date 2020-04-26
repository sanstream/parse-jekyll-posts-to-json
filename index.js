const fs = require('fs')
const yaml = require('yaml')
const ndjson = require('ndjson')

const serialize = ndjson.serialize()

serialize.on('data', function(line) {
  // line is a line of stringified JSON with a newline delimiter at the end
  fs.writeFileSync('out.ndjson', line, { flag: 'a' }, err => {})
})
// const testHTML = '/home/sanne/Projects/Code/sanstream-jekyll/front-end/_posts/2013-08-11-a-conversion-diagram.html'
// const testMD = '/home/sanne/Projects/Code/sanstream-jekyll/front-end/_posts/ 2015-08-23-charting-emotions.md'
const dir = '/home/sanne/Projects/Code/sanstream-jekyll/front-end/_posts/'
fs.readdirSync(dir, 'utf-8').forEach(fileName => {
  const file = fs.readFileSync(dir + fileName,  'utf8')
  const fileChunks = file.split('---\n')
  const yamlFrontmatter = yaml.parse(fileChunks[1])
  const content = fileChunks[2]
  console.log(fileChunks.length)
  
  serialize.write({
    ...yamlFrontmatter,
    content,
  })
})
serialize.end()

