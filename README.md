# eladmin-qt

eladmin 前端源码

#### 后端源码
- 码云: [https://gitee.com/elunez/eladmin](https://gitee.com/elunez/eladmin)
- github: [https://github.com/elunez/eladmin](https://github.com/elunez/eladmin)

#### eladmin开发文档
[http://docs.auauz.net/#/](http://docs.auauz.net/#/)

## Build Setup
``` bash
# 安装依赖
npm install

# 启动服务 localhost:9526
npm run dev

# 构建生产环境
npm run build
```
#注意
错误解决
package.json 中的"webpack-dev-server": "3.3.1",为此版本
npm 之前请先检查webpack-dev-server版本


plugins文件下下面为不打包资源，因主题功能有刷新不重置效果，需要保存在本地，引入路径需人为配置，因打包后找不到文件，不做打包
此文件上传服务器放到dist文件夹下面即可

#### 反馈交流

- QQ交流群：<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=90830191a40600e3a07acdcc4864890fca50c8e3ca1772e7e288a561d576f6c4"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="Quella/el-admin" title="Quella/el-admin"></a>

- 作者邮箱：elunez@qq.com