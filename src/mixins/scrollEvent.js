export default {
 data(){
   return {
    style:{},
   }
 },
 computed: {
  sideBarFixed(){
     return this.$store.state.settings.sideBarFixed
  },
  fixedHeader(){
    
      return this.$store.state.settings.fixedHeader
    },
 },
  methods: {
    handleScroll: function () {
            
      let scrollObj = document.documentElement; // 滚动区域
      let x = document.getElementsByClassName('main-container')[0].offsetLeft
      let scrollHeight = scrollObj.scrollTop; // 滚动条的总高度
      //滚动条到底部的条件
      let top
      if(this.sideBarFixed || this.fixedHeader){
        top ='50px'
      }else{
        top ='5px'
      }
      if(100 <= scrollHeight){
        this.style={position:'fixed',top:top,left:x+'px',zIndex:'99999',width:'80%',height:'50px',background:'#fff',marginLeft:'1%'}
          // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
      }  else{
         this.style={}
      }
  },
},
mounted: function() {
  const that = this
  window.onresize = function temp() {
    that.height = document.documentElement.clientHeight - 180 + 'px;'
  }
  window.addEventListener('scroll', that.handleScroll, true);  // 监听（绑定）滚轮滚动事件
    
},
 destroyed: function () {
      window.removeEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
    },
}
