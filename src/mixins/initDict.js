import { children } from '@/api/dict'
export default {
  data() {
    return {
      dicts: []
    }
  },
  methods: {
    initDicts(...names){
      this.dicts = []
      this.loadDict(...names)
    },
    loadDict(...names) {
      if(names.length == 0){
        return
      }
      let name = names.pop()
      const _this = this
      children({label: name}).then(res => {
        _this.dicts[name] = res.data
      }).catch(err => {

      })
      _this.loadDict(...names)
    },
    getDictOptions(name){
      return this.dicts[name]
    },
    getDictLabel(value,name){
      let label = value
      if(this.dicts[name]){
        this.dicts[name].some(dict=>{
          if(dict.value == value){
            label = dict.label
            return true
          }
          return false
        })
      }
      return label
    }
  }
}
