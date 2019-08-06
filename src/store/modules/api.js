const baseUrl = process.env.BASE_API
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // 图片上传
    imagesUploadApi: baseUrl + '/api/pictures',
    // 修改头像
    updateAvatarApi: baseUrl + '/cloud-admin/user/updateAvatar',
    // 上传文件到七牛云
    qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
    // Sql 监控
    sqlApi: baseUrl + '/druid',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html'
    // swaggerApi: 'http://172.31.11.40:8000/swagger-ui.html'
  }
}

export default api
