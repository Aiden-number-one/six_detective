/*
 * @Author: liangchaoshun
 * @Email: liangchaoshun@szkingdom.com
 * @Date: 2019-12-31 18:04:22
 * @LastEditors  : liangchaoshun
 * @LastEditTime : 2020-01-11 09:21:09
 * @Description: webpack 插件：动态向模板中添加 样式标签 和 脚本标签
 */

const fs = require('fs');
const path = require('path');

class InsertTag {
  apply(compiler) {
    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.emit.tapAsync('InsertTag', (compilation, callback) => {
      const _this = this;

      /* compilation.hooks.optimizeAssets.tap('InsertTag', (assets, cb) => {
        const dir = path.join(__dirname, '../public/xspreadsheet');
        const originSource = assets['index.html'].source();
        assets['mydoc.md'] = {
          source() {
            const joinCssSource = _this.insertTagHandler('css', originSource, dir, /^xspreadsheet.+\.css$/);
            const joinJsSource = _this.insertTagHandler('js', joinCssSource, dir, /^xspreadsheet.+\.js$/);
            return joinJsSource;
          }
        };
        cb();
      }); */
      // console.log('ASSETS >>>', compilation.assets);

      /* for (let filename in compilation.assets) {
        if (filename === 'index.html') {
          const originSource = compilation.assets[filename].source();
          compilation.assets['mydoc.md'] = {
            source() {
              const joinCssSource = _this.insertTagHandler('css', originSource, dir, /^xspreadsheet.+\.css$/);
              const joinJsSource = _this.insertTagHandler('js', joinCssSource, dir, /^xspreadsheet.+\.js$/);
              return joinJsSource;
            }
          }
        }
      } */

      

      /* const dir = path.join(__dirname, '../public/xspreadsheet');
      const originSource = compilation.assets['index.html'].source();
      compilation.assets['mydoc.md'] = {
        source() {
          const joinCssSource = _this.insertTagHandler('css', originSource, dir, /^xspreadsheet.+\.css$/);
          const joinJsSource = _this.insertTagHandler('js', joinCssSource, dir, /^xspreadsheet.+\.js$/);
          return joinJsSource;
        }
      }; */




      // Loop through all compiled assets,
      // adding a new line item for each filename.
      for (var filename in compilation.assets) {
        if (/index\.html$/.test(filename)) {
          console.log('filename -> ', filename);
        }
      }

      if (compilation.assets['index.html']) {
        const dir = path.join(__dirname, '../public/xspreadsheet');
        const originSource = compilation.assets['index.html'].source();
        compilation.assets['index.html'].source = () => { // TODO: FIXME:
          const joinCssSource = _this.insertTagHandler('css', originSource, dir, /^xspreadsheet.+\.css$/);
          const joinJsSource = _this.insertTagHandler('js', joinCssSource, dir, /^xspreadsheet.+\.js$/);
          return joinJsSource;
        }

        // new one
        compilation.assets['filelist.md'] = {
          source: function() {
            return compilation.assets['index.html'].source();
          }
        };
      }

      callback();

    });


    /* compiler.hooks.emit.tapAsync('InsertTag', (compilation, callback) => {
      const _this = this;

      compilation.hooks.optimizeChunkAssets.tapAsync('InsertTag', (chunks, cb) => {
        chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            if (file === 'index.html') {
              compilation.assets[file] = {
                source() {
                  const source = compilation.assets[file].source();
                  const dir = path.join(__dirname, '../public/xspreadsheet');
                  const joinCssSource = _this.insertTagHandler('css', source, dir, /^xspreadsheet.+\.css$/);
                  const joinJsSource = _this.insertTagHandler('js', joinCssSource, dir, /^xspreadsheet.+\.js$/);
                  return joinJsSource;
                }
              }
            }
          })
        })
        cb();
      });
      callback();
    }); */


    /* compiler.hooks.emit.tapAsync('InsertTag', (compilation, callback) => {
      const _this = this;
      compilation.hooks.afterOptimizeChunkAssets.tap('InsertTag', chunks => {
        chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            if (file === 'index.html') {
              compilation.assets[file] = {
                source() {
                  const source = compilation.assets[file].source();
                  const dir = path.join(__dirname, '../public/xspreadsheet');
                  const joinCssSource = _this.insertTagHandler('css', source, dir, /^xspreadsheet.+\.css$/);
                  const joinJsSource = _this.insertTagHandler('js', joinCssSource, dir, /^xspreadsheet.+\.js$/);
                  return joinJsSource;
                }
              }
            }
          })
        });
      });
      callback();
    }); */
  }

  /**
   *
   * @param {String} tagType 标签类型
   * @param {String} source 源文件的内容
   * @param {String} directory 需要插入标签的文件所在路径
   * @param {RegExpress} regExp 动态匹配要插入的标签的文件名
   * @description 插入标签的处理方法
   */
  insertTagHandler(tagType, source, directory, regExp) {
    switch (tagType.toLowerCase()) {
      case 'js':
        return this.insertJsTagHandler(source, directory, regExp);
      case 'css':
        return this.insertCssTagHandler(source, directory, regExp);
    }
  }

  // 插入脚本标签的处理方法
  insertJsTagHandler(source, directory, regExp) {
    const startBodyIndex = source.indexOf('<body>');
    const endBodyIndex = source.indexOf('</body>');
    const scriptIndex = source.indexOf('<script', startBodyIndex);
    const plot = scriptIndex === -1 ? endBodyIndex : scriptIndex; // 要插入的位置

    if (plot !== -1) {
      const frontSource = source.substring(0, plot); // 前半部分字符串
      const backSource = source.substring(plot); // 后半部分字符串

      const fileList = fs.readdirSync(directory); // 读取目录
      const targetName = fileList.filter(v => regExp.test(v)); // 匹配到要插入的文件名
      const scriptTag = `<script src="/xspreadsheet/${targetName}"></script>`; // 创建一个脚本标签
      return frontSource + scriptTag + backSource; // 组装返回
    }
  }

  // 插入样式标签的处理方法
  insertCssTagHandler(source, directory, regExp) {
    const plot = source.indexOf('</head>'); // 要插入的位置
    if (plot !== -1) {
      const frontSource = source.substring(0, plot); // 前半部分字符串
      const backSource = source.substring(plot); // 后半部分字符串
      const fileList = fs.readdirSync(directory); // 读取目录
      const targetName = fileList.filter(v => regExp.test(v)); // 匹配到要插入的文件名
      const linkTag = `<link href="/xspreadsheet/${targetName}" rel="stylesheet" />`; // 创建一个样式标签
      return frontSource + linkTag + backSource; // 组装返回
    }
  }
}

module.exports = InsertTag;
