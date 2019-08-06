import { initDataFormData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 170
    }
    // size:初始化一页的条数
  },
  methods: {
    async init(param) {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        Object.assign(this.params,param)
        initDataFormData(this.url, this.params).then(res => {
          this.total = res.data.totalElements
          this.data = res.data.content
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e
      this.init()
    },
    sizeChange(e) {
      console.log(e)
      this.page = 0
      this.size = e
      this.init()
    }
  }
}
