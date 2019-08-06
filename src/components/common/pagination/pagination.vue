<template>
  <!--分页-->
  <div class="pagenation-container">
    <nav>
      <ul class="pagination">
        <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(current - 1)"> « </a></li>
        <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
        <li v-for="(p,index) in grouplist" :class="{'active': current == p.val}"  :key="index"><a href="javascript:;"
                                                                            @click="setCurrent(p.val)"> {{ p.text }} </a>
        </li>
        <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
        <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(current + 1)"> »</a></li>
      </ul>
    </nav>
  </div>
</template>
<script>
  export default {
    props: {
      total: {// 数据总条数
        type: Number,
        default: 0
      },
      display: {// 每页显示条数
        type: Number,
        default: 10
      },
      currentPage: {// 当前页码
        type: Number,
        default: 1
      },
      pagegroup: {// 分页条数
        type: Number,
        default: 5,
        coerce: function (v) {
          v = v > 0 ? v : 5;
          return v % 2 === 1 ? v : v + 1;
        }
      }
    },
    data() {
      return {
        current: this.currentPage
      };
    },
    methods: {
      setCurrent: function (idx) {
        if (this.current != idx && idx > 0 && idx < this.page + 1) {
          this.current = idx;
          this.$emit('pagechange', this.current);
        }
      }
    },
    computed: {
      page: function () { // 总页数
        return Math.ceil(this.total / this.display);
      },
      grouplist: function () { // 获取分页页码
        var len = this.page, temp = [], list = [], count = Math.floor(this.pagegroup / 2), center = this.current;
        if (len <= this.pagegroup) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len});
          }
          ;
          return temp;
        }
        while (len--) {
          temp.push(this.page - len);
        }
        ;
        var idx = temp.indexOf(center);
        (idx < count) && ( center = center + count - idx);
        (this.current > this.page - count) && ( center = this.page - count);
        temp = temp.splice(center - count - 1, this.pagegroup);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.page > this.pagegroup) {
          (this.current > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.current < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1});
        }
        return list;
      }
    },
  }
</script>
<style scoped>
  .pagination {
    position: relative;

  }
  .pagenation-container{
    margin:40px auto 0;
    width:260px;
  }
  .pagination li{
    display: inline-block;
    margin:0 0px;
  }
  .pagination li span{
    padding:2px;
    display:inline-block;
    color:#fff;
    background:#032148;
    line-height:25px;
  }

  .pagination li.active a{
    color:#FFD440;
  }
  .active:before{
    content:"";
    width:0px;
    border-bottom:14px solid transparent;
    border-top:14px solid transparent;
    border-right:10px solid #032148;
    position:absolute;
    left:-10px;
    top:0px;
  }
  .pagination li.active{
    min-width:14px;
    height:27px;
    background:#032148;
    display: inline-block;

    color:#FFFFFF;
    margin:0 10px;
    text-align: center;
  }
  .active:after{
    content:"";
    width:0px;
    border-bottom:14px solid transparent;
    border-top:14px solid transparent;
    border-left-width:10px;
    border-left-style: solid;
    border-left-color:#032148;
    position:absolute;
    right:-10px;
    top:0px;
  }
  .pagination li span{
    background:none;
    cursor:pointer;

  }
  .pagination li{
    position:relative;float:left;
  }
  .show-two .container-one{
    padding:0px;
    overflow:hidden;
    width:100%;
    height:100%;
  }
  .show-two .container-one .jk{
    width:100%;
    /* height:15rem */
  }
  .left-n,.right-n{
    background-size:100% 100%;
    width:30px;
    height:27px;
    background-position:center center;
    background-repeat:no-repeat;
    text-align:center;
  }
  .right-n a{
    position:relative;
    left:-2px;
  }
  .left-n a{
    position:relative;
    left:-1px;
  }
  .hd-title{
    font-size:1.8rem;
    color:#fff;
    text-align: center;
    margin:0;
    line-height:3.6rem;
    letter-spacing: 4px;
  }
</style>