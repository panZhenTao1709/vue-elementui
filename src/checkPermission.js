import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/auth/directive.vue
 */
export  function checkPermission(name,_this) {
  const params = getCurrentParams(_this).concat(name)
  if ( params.length > 0) {
    const codes = store.getters && store.getters.codes
    let permissionCodes
    switch(params.length)
      {
        case 3:
            permissionCodes = codes[params[0]][params[1]][params[2]]
            break;
        case 2:
            permissionCodes = codes[params[0]][params[1]]
            break;
        case 1:
            permissionCodes = codes[params[0]]
            break;
      }
    if(!permissionCodes){
      return false
    }
     return true
   
  } else {
    console.error(`需要权限`)
    return false
  }
}


  function getCurrentParams(_this) {
      let matched = _this.$route.matched.filter(item => {
        if (item.name) {
          return true
        }
      })
      const paramsAarry = new Array()
        matched.map(o => {
        paramsAarry.push(o.meta.title)
      });
      return paramsAarry
    }

