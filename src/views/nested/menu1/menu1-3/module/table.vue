<template>
  <div style="padding-left:5px">
    <el-table
      v-loading="loading"
      :data="data"
      border
      style="width: 100%">
      <el-table-column
        label="销售区域"
        width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sellareaname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="销售区域所绑定的行政区域"
        width="300">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.areaName }}</span>
        </template>

      </el-table-column>
      <el-table-column label="操作">

        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)">增加绑定</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">
{{ $t('btn.cancel') }}绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :current-page="10"
      :page-size="10"
      :page-sizes="[5, 10, 20, 30]"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>

    <!-- 绑定的行政区域修改 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      width="530px"
      title="绑定行政区域"
      center>
      <p>选择行政区域</p>
      <el-main>
        <el-select v-model="province" placeholder="省" style="width: 435px;" @change="indexSelectProvince">
          <el-option
            v-for="item in selectProvince"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-model="city" placeholder="市" style="width: 435px;" @change="indexSelectCity">
          <el-option
            v-for="item in selectCity"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-model="area_p" placeholder="区" style="width: 435px;" @change="indexSelectArea">
          <el-option
            v-for="item in selectArea"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-model="street" placeholder="街道" style="width: 435px;" @change="indexSelectStreet">
          <el-option
            v-for="item in selectStreet"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-main>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dosubmitBind">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { initData } from '@/api/data'
import initTreeData from '@/mixins/initTreeData'
import checkPermission from '@/utils/permission'
import { deleteRelevance, getProvinces, sellerAreabind } from '@/api/administrativeDivision'
export default {
  mixins: [initTreeData],
  props: {
    paramss: {
      type: Object,

      required: true
    }
  },
  data() {
    return {
      daqu: '', fenbu: '', area: '',
      sellerAreaId: 'eb1400a229d9474c87bd5ade49857f1b',
      districtId: '',
      // sellerAreaId: '',
      centerDialogVisible: false,
      selectProvince: [], selectCity: [], selectArea: [], selectStreet: [],
      province: '', city: '', area_p: '', street: ''
    }
  },
  created() {
    if (this.paramss.sellerAreaId != null && this.paramss.sellerAreaId !== 0) {
      this.sellerAreaId = this.paramss.sellerAreaId
    }

    this.$nextTick(() => {
      this.init()
    })
  },

  methods: {
    checkPermission,
    handleEdit(index, row) {
      this.centerDialogVisible = true
      getProvinces().then(res => {
        this.selectProvince = res
      })
      this.sellerAreaId = row.sellareaId
    },
    handleDelete(index, row) {
      const data = {
        districtId: row.districtId,
        sellerAreaId: row.sellareaId
      }
      deleteRelevance(data).then(res => {
        // 成功之后数据init
        this.init()
      })
    },
    beforeInit() {
      this.url = 'api/sellerArea/relevanceList'
      this.params = { page: this.page, size: this.size, sellerAreaId: this.sellerAreaId }

      return true
    },
    // 销售区域绑定行政区域
    indexSelectProvince: function() {
      initData('api/district/getChildren', { id: this.province }).then(res => {
        this.selectCity = res
      })
    },
    indexSelectCity: function() {
      initData('api/district/getChildren', { id: this.city }).then(res => {
        this.selectArea = res
      })
    },
    indexSelectArea: function() {
      initData('api/district/getChildren', { id: this.area_p }).then(res => {
        this.selectStreet = res
      })
    },
    indexSelectStreet: function() {
      this.districtId = this.street
    },
    dosubmitBind: function() {
      this.loading = false
      this.centerDialogVisible = false
      sellerAreabind({ sellerAreaId: this.sellerAreaId, districtId: this.districtId }).then(res => {
        this.init()
        this.loading = true
      })
      // 数据初始化
      this.selectProvince = null
      this.selectCity = null
      this.selectArea = null
      this.selectStreet = null
      this.province = null
      this.city = null
      this.area_p = null
      this.street = null
    }
  }
}
</script>
