<template>
  <baidu-map
    :center="{lng: 116.404, lat: 39.915}"
    :zoom="14"
    class="map"
    @mousemove="syncPolyline"
    @click="paintPolyline"
    @rightclick="newPolyline">
    <bm-control>
      <button @click="toggle('polyline')">{{ polyline.editing ? '停止绘制' : '开始绘制' }}</button>
    </bm-control>
    <bm-polyline v-for="path of polyline.paths" :path="path" :key="path"/>
  </baidu-map>
</template>
<script>
export default {
  data() {
    return {
      polyline: {
        editing: false,
        paths: []
      }
    }
  },
  methods: {
    toggle(name) {
      this[name].editing = !this[name].editing
    },
    syncPolyline(e) {
      if (!this.polyline.editing) {
        return
      }
      const { paths } = this.polyline
      if (!paths.length) {
        return
      }
      const path = paths[paths.length - 1]
      if (!path.length) {
        return
      }
      if (path.length === 1) {
        path.push(e.point)
      }
      this.$set(path, path.length - 1, e.point)
    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return
      }
      const { paths } = this.polyline
      if (!paths.length) {
        paths.push([])
      }
      const path = paths[paths.length - 1]
      path.pop()
      if (path.length) {
        paths.push([])
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return
      }
      const { paths } = this.polyline
      !paths.length && paths.push([])
      paths[paths.length - 1].push(e.point)
    }
  }
}
</script>
