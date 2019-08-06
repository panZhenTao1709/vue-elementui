import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 1, size: 10, total: 0, url: '', params: {}, query: {}, time: 170
    }
    // size:初始化一页的条数
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          // console.log(res)
          this.total = res.total
          this.data = res.list
          // console.log(this.total, this.data)
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
      // console.log(e)
      this.page = e
      this.init()
    },
    sizeChange(e) {
      // console.log(e)
      this.page = 1
      this.size = e
      this.init()
    }
  }
}
