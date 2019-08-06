<template>
  <div>
    <h2>子组件部分</h2>
    <p>{{ message }}</p>
    <button @click="sedMsgToParent">向父组件传值</button>
  </div>
</template>
<script>
export default{
  prop: ['message'],
  methods: {
    sendMsgToParent: function() {
      this.$emit('listenToChildEvent', 'this message if from child')
    }
  }
}
</script>
