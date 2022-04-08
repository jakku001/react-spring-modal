# React library从创建到发布

先看工程文件树
```
.
├── example
│   └── src
│       ├── index.css
│       ├── index.html
│       └── index.js
├── LICENSE
├── npm_deploy.MD
├── package.json
├── package-lock.json
├── .gitignore
├── .npmignore
├── README.MD
├── src
│   ├── component
│   │   └── modal
│   │       ├── index.js
│   │       ├── Card.css
│   │       └── Card.js
│   └── index.js
└── webpack.config.js
```

`example`：测试文件夹，其中文件是普通的react项目文件，会在后文的`测试`章节 详细介绍。

`LICENSE`：项目开源证书，可以在github上添加(在github页面上添加文件，输入license，就会跳出模板)。

`package.json`: 项目依赖文件，会在后文 `依赖` 章节 和 `构建` 章节 里详细介绍。

`README.MD`：项目说明，它既是github的readme，也是npmjs上的说明文档，会在后文 `readme`章节详细介绍。

`src`：library的源码目录， 会在 `library源码` 章节详细介绍。

`webpack.config.js`: 测试用的webpack配置， 会在 `测试`章节详细介绍。

`.npmignore`: 发布配置，`npm publish`时忽略的文件，会在`发布`章节详细介绍。

## 1. 依赖

在介绍依赖前，先介绍依赖类型，`开发时依赖(devDependencies)` 和 `运行时依赖(dependencies)` 

当该 `library` 被客户端 `npm install` 时，它的 `dependencies` 也会被 install， 而 `devDependencies` 不会。

`本工程构建的library运行时依赖 react-spring ，所以react-spring被加入到dependencies，如果加入devDependencies，那么客户端需要手动安装react-spring` 。

接下来来看 `package.json`

```json
{
  "name": "@jakku001/react-spring-modal",
  "version": "1.0.11",
  "description": "An react modal depends on react-spring",
  "title": "@jakku001/react-spring-modal",
  "keywords": [
    "react",
    "react-component",
    "react-spring",
    "modal"
  ],
  "homepage": "https://github.com/jakku001/react-spring-modal",
  "repository": {
    "type": "git",
    "url": "https://github.com/jakku001/react-spring-modal"
  },
  "main": "dist/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --env dev",
    "build": "babel src -d dist --copy-files"
  },
  "author": "jakku001",
  "license": "MIT",
  "peerDependencies": {
    "react": ">=16.0.1",
    "react-dom": ">=16.0.1"
  },
  "devDependencies": {
    "@babel/cli": "^7.17.6",
    "@babel/core": "^7.17.8",
    "@babel/preset-env": "^7.16.11",
    "@babel/preset-react": "^7.16.7",
    "babel-loader": "^8.2.4",
    "css-loader": "^6.7.1",
    "html-webpack-plugin": "^5.5.0",
    "mini-css-extract-plugin": "^2.6.0",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "style-loader": "^3.3.1",
    "webpack": "^5.71.0",
    "webpack-bundle-analyzer": "^4.5.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.7.4",
    "webpack-merge": "^5.8.0"
  },
  "dependencies": {
    "react-spring": "^9.4.4"
  }
}
```
`name`：就是该library的node_module名称。`title`一般与name一致。

`description`: npmjs上用于展示描述。

`versoin`: 工程初始化时默认1.0.0，后续由 `npm version [major/minor/patch]` 命令维护。 major是第一位，minor第二位，patch第三位。忽略预发(premajor/preminor/prepatch)。该命令会自动git commit。

`keywords`: 是个数组，npmjs会展示，影响包名搜索。

`homepage`和`repository`: 一般填工程的首页或github链接。

`*main`: 很重要，import该library，默认就是读main指定的文件。

`scripts`: 这里包含了两个最常用的 start 和 build。其中start 用于本工程的webpack测试。build使用 @babel/cli 打包。

`author`: 作者名

`license`: 根据工程的证书类型设置。

`peerDependencies`: 使用该library的依赖版本限制

至于依赖，都是react常用的依赖。

## 2. library源码

首先是一个简单的组件 `Card`

`src/component/card/Card.js`

```js
import React from "react";
import "./Card.css";

export default function Card(props) {
  const { content } = props;

  return(
    <div>{content}</div>
  )
}
```

`src/component/card/index.js`
```js
export { default as default } from "./Card";
```

`src/index.js`

```js
export { default as default } from "./component/card";
```

## 3. 测试

`测试代码可以直接从源码或构建后的目录里import组件`

在example目录编写测试代码

`example/src/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`ecample/src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import Card from "../../dist";
import "./index.css";

const App = () => {
  return (
    <div>
      <Card content="hello"/>
    </div>
  );
};

const root = document.getElementById("root");

ReactDOM.render(<App />, root);
```

webpack配置

项目根目录 `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const exampleRoot = "./example";

module.exports = {
  mode: "development",
  entry: path.resolve(exampleRoot, "src/index.js"),
  resolve: {
    fallback: {
      crypto: false,
      constants: false,
      stream: false,
      assert: false,
    },
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../",
                },
              },
              "css-loader",
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
      chunkFilename: "[id].css",
    }),
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      inject: true, //inject all js at the bottom of the body
      template: path.resolve(exampleRoot, "src/index.html"), //source file
    }),
  ],
  devServer: {
    historyApiFallback: false,
    allowedHosts: "all",
    port: 3000,
  },
};
```

特别注意 `devServer.allowedHosts="all"`, 因为 gitpod 这种可能使用域名访问，而非ip，不配置allowdHosts，就无法访问。

`.babelrc`
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}

```

启动
```
npm start
```

## 4. README 编写

`README.MD` 一般也会发布到npmjs，这里主要介绍 `图片插入` 和 `codesandbox` 引入

`注意：README.MD如果更新了，也需要发布新版本到npmjs`。

### 4.1 插入图片

`README.MD` 里直接引用工程里的图片，加载速度会非常慢。最简单的办法是在github issue里拖拽上传，然后就能获得图片地址。

### 4.2 嵌入`codesandbox`

`在发布了版本后，就可以在codesandbox里创建一个工程引入library，写好测试代码，最后嵌入README`。

codesandbox 使用了虚拟机运行vscode，可以直接执行终端命令，使用最简单。

codesandbox工程的share按钮，其中包含 embed(嵌入) 选项，它有源码嵌入，超链接嵌入等多种方式。

MARKDOWN不支持源码(iframe)嵌入，所以用超链接嵌入，codesandbox会自动生成一个超链接的按钮代码，复制到markdown里就行。

## 5. 发布

### 5.1 指定发布文件

`npm publish` 会把项目根目录下所有文件发布到npmjs，所以需要配置 `.npmignore` 把那些不需要发布的文件排除在外

需要发布的文件如下

```
dist
README.MD
package.json
package-lock.json
LICENSE
```
所以忽略文件的名单如下
`.npmignore`
```
src
examples
.babelrc
.gitignore
webpack.config.js
npm_deploy.MD
.gitpod.yml
```

执行发布需要有npmjs的账号，去官网注册就行，然后在本地使用 `npm login` 登录

`注意：你本地的npm registry(仓库)如果不是npmjs，那就要切回npmjs，可以使用nrm模块管理registry`

### 5.2 发布版本
#### 5.2.1 增加版本号

发布新版本，需要package.json里的版本号大于npmjs上的版本号。
版本号维护命令是
```
npm versoin [major/minor/patch]
```
`注意：这个命令会自动为git增加一个commit`

#### 5.2.2 构建

```
npm run build
```
使用 package.json 中的 build脚本执行构建

脚本内容如下

```
babel src -d dist --copy-files
```

用 @babel/cli 的babel命令把 src目录下的js文件编译成es5代码并存到dist目录，babel命令的具体细节可以去官网查看。


#### 5.2.3 执行发布

```
npm publish
```

需要指定package的访问权限，开源的是public, `npm publish --access public`

`功能迭代` 和 `README更新` 都是通过发布新版本来做的。

#### 5.2.4 删除版本(逆发布)

```
npm unpublish package_name/@versoin
```








