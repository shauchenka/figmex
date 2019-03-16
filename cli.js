#!/usr/bin/env node
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const meow = require('meow')
const chalk = require('chalk')
const Figma = require('figma-js')
const parse = require('./modules/index')
const convert = require('./modules/convert')
const config = require('pkg-conf').sync('figmex')

const log = (...args) => {
    console.log(
        chalk.cyan('[figmex]'),
        ...args
    )
}
log.error = (...args) => {
    console.log(
        chalk.red('[error]'),
        ...args
    )
}


const cli = meow(`
  ${chalk.gray('Usage')}

    $ figmex <file-id>

  ${chalk.gray('Options')}

    -d --out-dir    Output directory (default cwd)
    --metadata      Include metadata from Figma API
    --format      SCSS / LESS / etc

`, {
    flags: {
        outDir: {
            type: 'string',
            alias: 'd'
        },
        metadata: {
            type: 'boolean'
        },
        format: {
            type: 'string',
            alias: 'f'
        },
        debug: {
            type: 'boolean'
        }
    }
})

const token = process.env.FIGMA_TOKEN
const [ id ] = cli.input

const opts = Object.assign({
    outDir: 'styles',
    format: 'less'
}, config, cli.flags)



if (!token) {
    log.error('FIGMA_TOKEN not found')
    process.exit(1)
}

if (!id) {
    cli.showHelp(0)
}

const format =opts.format
opts.outDir = path.resolve(opts.outDir)

if (!fs.existsSync(opts.outDir)) {
    fs.mkdirSync(opts.outDir)
}

const outFile = path.join(
    opts.outDir,
    'theme.json'
)

const outFileFlat = path.join(
    opts.outDir,
    'themeFlat.json'
)



const StyleDictionary = require("style-dictionary").extend({
    source: [outFile],
    platforms: {
        scss: {
            transformGroup: format,
            files: [
                {
                    destination: path.join(opts.outDir, `_colors.${format}`),
                    format: `${format}/variables`,
                    filter: {
                        type: "color"
                    }
                },
                {
                    destination: path.join(opts.outDir, `_typography.${format}`),
                    format: `${format}/variables`,
                    filter: {
                        type: "typography"
                    }
                },
                {
                    destination: path.join(opts.outDir, `_spacers.${format}`),
                    format: `${format}/variables`,
                    filter: {
                        type: "spacers"
                    }
                }
            ]
        }
    }

});


const figma = Figma.Client({
    personalAccessToken: token
})

log('fetching data for:', chalk.gray(id))

figma.file(id)
    .then(async res =>  {
        if (res.status !== 200) {
            log.error(res.status, res.statusText)
            process.exit(1)
            return
        }
        const { data } = res

        log('parsing data...')
        const dt = await convert(data);
        const jsonFlat = JSON.stringify(parse(data, opts), null, 2)
        const json = JSON.stringify(dt, null, 4)



        fs.writeFile(outFileFlat, jsonFlat, (err) => {
            if (err) {
                log.error(err)
                process.exit(1)
            }
            log('flat json file saved', chalk.gray(outFileFlat))
        })

        fs.writeFile(outFile, json, (err) => {
            if (err) {
                log.error(err)
                process.exit(1)
            }
            log('file saved', chalk.gray(outFile))
            StyleDictionary.buildAllPlatforms();
            log("CSS generated");
        })

        if (opts.debug) {
            fs.writeFile(path.join(opts.outDir, 'data.json'), JSON.stringify(data, null, 2), err => {})
        }
    })
    .catch(err => {
        log('err')
        log(err)
        const { response } = err
        log.error(response.status, response.statusText)
        process.exit(1)
    })

require('update-notifier')({
    pkg: cli.pkg
}).notify()
