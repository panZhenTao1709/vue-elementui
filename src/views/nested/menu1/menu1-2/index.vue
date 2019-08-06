<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="三级菜单2" type="success">
      <v-button :message="parentMsg" @listenToChildEvent="showMsgFromChild" />
    </el-alert>
  </div>
</template>
<script>
import ButtonCounter from './buttonCounter'
export default {
  name: 'Index',
  components: {
    'v-button': ButtonCounter
  },
  data() {
    return {
      parentMsg: 'hello,world'
    }
  },
  methods: {
    showMsgFromChild: function(data) {
      console.log(data)
    }
  }
}
</script>
