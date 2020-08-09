import path from 'path'
import fs from 'fs'
import minimist from 'minimist'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { string } from 'rollup-plugin-string'
import vue from 'rollup-plugin-vue2'
import less from '@ywzhaiqi/rollup-plugin-less'
import myFixMetadata from './rollup-plugin-fix-userscript-metadata'

// config
const indexFiles = ['index.js', 'index.user.js', 'index.ts', 'index.user.ts']
const OUT_DIR = 'scripts'
// TODO: 还没生效
const configName = 'rollup.config.js'

const command = minimist(process.argv.slice(2))
const rootDir = path.join(__dirname, '.')

function getInput(input) {
  let args = {
    file: '',
    dir: '',
    outdir: '',
    outfile: '',
    rollupConfig: '',
    watch: false,
  }

  // fix PowserShell yarn 下传入最后会多一个" '.\\src\\MyNovelReader"'
  if (typeof input == 'string') {
    input = input.replace(/"$/, '')
  }

  if (!input || !fs.existsSync(input)) {
    return args
  }

  let stats = fs.lstatSync(input)
  if (stats.isFile() && input.match(/\.jsx?$/)) {
    args.file = input
  } else if (stats.isDirectory()) {
    args.dir = input
    args.file = 'index.js'

    for (let f of indexFiles) {
      if (fs.existsSync(path.join(args.dir, f))) {
        args.file = f
        break
      }
    }

    // 判断是否存在配置
    let configFile = path.join(rootDir, 'src', args.dir, configName)
    if (fs.existsSync(configFile)) {
      console.log('使用配置文件：', configFile)
      args.rollupConfig = require(configFile)
    }
  }

  if (args.dir) {
    args.outdir = path.dirname(args.dir.replace(/src[\/\\]/, ''))
  }

  if (args.file) {
    args.outfile = args.dir ?
      (path.basename(args.dir) + '.user.js') :
      args.file
        .replace(/src[\/\\]/, '')
        .replace(/\.[jt]sx?$/, '.user.js')
        .replace('.user.user.js', '.user.js')
  }

  return args
}

const args = getInput(command.myinput)
if (!args.file) {
  console.error(`参数错误，文件不存在。
Usage:
  npm run build src/MyNovelReader [-w]
             或 src\\MyNovelReader`)
  process.exit()
}

let inputScript = path.join('.', args.dir, args.file)
let outputScript = path.join(rootDir, OUT_DIR, args.outdir, args.outfile)

let config = {
  input: inputScript,
  output: {
    file: outputScript,
    format: 'iife',
    banner: '/* This script build by rollup. */',
    globals: {
      'jquery': 'jQuery',
      'zepto': 'Zepto',
      'dayjs': 'dayjs',
      // 'underscore': 'underscore',
      // 'react': 'React',
      // 'react-dom': 'ReactDOM',
      'vue': 'Vue',
      'md5': 'md5',
      'ajax-hook': 'ah',  // ajax-hook
    },

  },
  external: ['jquery', 'zepto', 'vue', 'dayjs', 'ajax-hook', 'md5'],
  
  plugins: [
    myFixMetadata(),
    resolve(),
    commonjs(),
    vue(),
    less({
      insert: true,
      include: ['**/*.less', '**/*.css'],
      exclude: [
        'src/MyNovelReader/**/*.css',  // 特殊的
      ],
      styleClass: 'noRemove',
    }),

    string({
      include: [
        '**/*.html',
        'src/MyNovelReader/**/*.css',  // 特殊的
      ],
    }),
    typescript(),
  ]
};

if (args.rollupConfig) {
  config = args.rollupConfig
}

export default config