const express = require('express')
const app = express()
// 导入 session 中间件
const session = require('express-session')

// 使用 app.use() 方法注册 session 中间件 - 注册为全局中间件
app.use(session({
  secret: 'Hello Session', // secret 属性的值可以为任意字符串 - 负责对 session 进行加密
  resave: false, // 固定写法
  saveUninitialized: true // 固定写法
}))

// 托管静态资源
app.use('/pages' ,express.static('./pages'))
app.use('/css' ,express.static('./css'))
app.use('/lib' ,express.static('./lib'))
app.use('/image' ,express.static('./image'))
// 解析 POST 请求提交的表单数据
app.use(express.urlencoded({ extended: false }))

app.post('/pages/login', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Method', '*')

  // 判断用户的用户名和密码四否正确 - 使用 req.body
  // 默认用户名为'admin', 密码为'98765'
  if (req.body.username !== 'admin' || req.body.password !== '98765') {
    return res.send({status: 1, msg: '登录失败。'})
  }

  req.session.user = req.body // 将请求信息存储在 session 中的 user 对象中 - user 是自己气的名字，并不固定。
  req.session.islogin = true // 将 session 中的 islogin 属性置为 true - islogin 同理也为自己起的名字。
  res.send({status: 0, msg: '登录成功。'})
})


// 获取用户姓名的接口
app.get('/pages/username', (req, res) => {
  // 先判断是否登录， 没登录直接返回错误信息
  if(!req.session.islogin) {
    return res.send({status: 1, msg: '未登录。'})
  }

  res.send({status: 0, msg: '获取用户名成功。', username: req.session.user.username})
})

// 退出登录的接口 - 要清空服务器保存的 session - 使用 req.session.destroy() 函数
app.post('/pages/logout', (req, res) => {
  // 清空服务器存储的 session 信息
  req.session.destroy()
  res.send({
    status: 0,
    msg: '退出登录成功'
  })
})


app.listen(8000, () => {
  console.log('开始监听8000端口。http://127.0.0.1:8000/pages/login.html')
})