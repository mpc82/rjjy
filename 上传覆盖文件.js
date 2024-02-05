const Koa = require('koa'); // 引入 koa
const router = require('koa-router')(); // 引入 koa-router
const app = new Koa(); // 起一个 koa 服务器
const static = require('koa-static');
const path = require('path');
const fs = require('fs');
const koaBody = require('koa-body').default;
app.use(koaBody({ multipart: true }));

// 这两个请求处理，是用来测试的
router.post('/updateIndex', async (ctx) => {
  try {
    // 获取HTML文件内容
    const htmlContent = ctx.request.files.html;  // 使用字段名来获取FormData中的HTML内容
    // 假设HTML内容通过POST请求的body传递
    // 存储文件到当前目录
    const originPath = htmlContent.filepath
    const currentPath = path.join('/web_app/cjjy', 'cache.html');
    // const currentPath = path.join(__dirname, 'cache.html');
    moveFile(originPath, currentPath);
    // // 返回更新成功消息
    ctx.body = {
      code:200,
      msg:'更新成功'
    };
    ctx.status = 200
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = '更新失败';
  }
});
app.use(static(__dirname + '/static'));
app.use(router.routes());

app.listen(3333); // 设置服务器的端口
function moveFile(sourcePath, targetPath) {
    const sourceStream = fs.createReadStream(sourcePath);
    const targetStream = fs.createWriteStream(targetPath);
    // fs.unlink(targetPath, (err) => {
    //   if (err) {
    //     console.error(`Error deleting source file: ${err}`);
    //   } else {
    //     console.log(`File moved successfully from ${sourcePath} to ${targetPath}`);
    //   }
    // });
    sourceStream.on('error', (err) => {
      console.error(`Error reading source file: ${err}`);
    });
  
    targetStream.on('error', (err) => {
      console.error(`Error writing to target file: ${err}`);
    });
  
    targetStream.on('finish', () => {
      // 删除源文件
      fs.unlink(sourcePath, (err) => {
        if (err) {
          console.error(`Error deleting source file: ${err}`);
        } else {
          console.log(`File moved successfully from ${sourcePath} to ${targetPath}`);
        }
      });

    });
  
    // 将源文件内容复制到目标文件
    sourceStream.pipe(targetStream);
  }
  
