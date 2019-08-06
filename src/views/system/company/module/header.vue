<template>
  <div class="head-container">
    <eForm ref="form" :is-add="isAdd" :sup_this="sup_this"/>
    <!-- 搜索 -->
    <el-input
      v-model="query.coName"
      clearable
      :placeholder="this.$t('table.enterNameSearch')"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"/>

    <el-button-group>
      <el-tooltip :content="this.$t('btn.search')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="info" icon="el-icon-search" @click="toQuery"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.add')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.edit')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="edit"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.del')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="del"/>
      </el-tooltip>
    </el-button-group>

    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  append-to-body>
  <span>是否删除选中数据?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="deldata">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>

  import eForm from './form'
  import {del} from '@/api/company'
  // 查询条件
  export default {
    components: {eForm},
    props: {
      sup_this: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        isAdd: true, //添加还是编辑
        query: { //查询条件
          coName: ''
        },
        centerDialogVisible: false,
        dialogVisible: false
      }
    },
    methods: {
      toQuery() {
        this.sup_this.init(this.query)
      },
      add() {
        this.$refs.form.dialog = true
        this.isAdd = true
        // this.$refs.form.form = {}
        this.$refs.form.getCompanys()
      },
      edit() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择公司,请选择一个公司!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的公司过多,请选择一个公司!',
            type: 'warning'
          })
          return
        }
        this.$refs.form.dialog = true
        this.isAdd = false
        let _this = this
        this.$refs.form.getCompanys()
        //赋值
        let company = this.sup_this.mutiSelection[0];
        this.$refs.form.form = {
          id: company.id,
          coName: company.coName,
          parentId: company.parentId,
          coAbbr: company.coAbbr,
          coCode: company.coCode,
          coAddr: company.coAddr,
          zipCode: company.zipCode,
          legalName: company.legalName,
          legalRep: company.legalRep,
          taxId: company.taxId,
          tel: company.tel,
          bankName: company.bankName,
          bankAcct: company.bankAcct
        }
      },
      del() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择公司,请选择一个公司!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的公司过多,请选择一个公司!',
            type: 'warning'
          })
          return
        }
        this.dialogVisible = true;
      },
      deldata(){
        this.dialogVisible = false;
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择公司,请选择一个公司!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的公司过多,请选择一个公司!',
            type: 'warning'
          })
          return
        }
        //赋值
        let company = this.sup_this.mutiSelection[0];
        //调用后台删除方法
        let _this = this
        del(company.id).then(res => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
          _this.$router.replace({
            path: this.$router.path,
            query: {
              t: Date.now()
            }
          })
          _this.sup_this.init()
        }).catch(err => {
          this.$notify({
            title: err.response.data.message,
            type: 'failed',
            duration: 2500
          })
          console.log(err.response)
        })
      }
    }
  }
</script>
