<template>
  <baidu-map :style="{height: widthData}" :center="center" :zoom="zoom" class="map" @ready="handler"/>
</template>
<script>
export default {
  data() {
    return {

      zoom: 15,
      widthData: (document.documentElement.clientHeight - 100) + 'px',
      type: 'tab',
      address_detail: null,
      center: { lng: 0, lat: 0 }
    }
  },
  mounted() {
    const height = document.documentElement.clientHeight
    console.log(height)
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      const point = new BMap.Point(this.center.lng, this.center.lat)
      map.centerAndZoom(point, 10)
      map.enableScrollWheelZoom(true)
      map.enableDoubleClickZoom(true)
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition((r) => {
        if (r.point) {
          this.center.lng = r.longitude
          this.center.lat = r.latitude
          const markers = new BMap.Marker(r.point)
          map.addOverlay(markers)
          map.panTo(r.point)
          map.centerAndZoom(r.point, 16)
        }
      }, { enableHighAccuracy: true })
    }

  }

}
</script>
<style>
.map {
  width: calc(100% -500px);

}
</style>
