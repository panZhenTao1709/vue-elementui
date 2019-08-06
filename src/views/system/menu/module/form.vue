<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? this.$t('table.newmenu') : this.$t('table.editmenu')" append-to-body width="600px" @close="cancel"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item :label="this.$t('table.menuicon')" v-show="form.menuType == 'menu'">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected"/>
          <el-input slot="reference" v-model="form.icon" style="width: 460px;" :placeholder="this.$t('table.clickselectcion')" readonly>
            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon"
                      style="height: 32px;width: 16px;"/>
            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item :label="this.$t('table.menuName')" prop="name">
        <el-input v-model="form.name" :placeholder="this.$t('table.designation')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.menucode')" prop="code">
        <el-input v-model="form.code" :placeholder="this.$t('table.menucodeunique')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.resourcetype')" prop="menuType">
        <el-select v-model="form.menuType" style="width: 370px" :placeholder="this.$t('table.resourcetype')">
          <el-option
            v-for="obj in menuType"
            :key="obj.value"
            :label="obj.label"
            :value="obj.value"
            :disabled="isMenu?(obj.value == 'api'?true:false):(obj.value == 'api'?false:true)"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$t('table.accesscode')" prop="permissionCode">
        <el-input v-model="form.permissionCode" :placeholder="this.$t('table.accesscodeunique')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.menusort')" prop="ordNum">
        <el-input v-model.number="form.ordNum" :placeholder="this.$t('table.numberforward')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.belongsToTheService')" prop="serviceId">
        <!--<el-input v-model="form.serviceId" placeholder="所属服务" style="width: 460px;"/>-->
        <treeselect v-model="form.serviceId" :options="services" style="width: 370px;" :placeholder="this.$t('table.selectserver')" />
      </el-form-item>
      <el-form-item :label="this.$t('table.chainedAddress')" prop="href">
        <el-input v-model="form.href" :placeholder="this.$t('table.menupath')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.requesttype')" prop="method">
        <el-select v-model="form.method" style="width: 370px" :placeholder="this.$t('table.requesttype')">
          <el-option
            v-for="obj in method"
            :key="obj.value"
            :label="obj.label"
            :value="obj.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$t('table.componentpath')" v-show="form.menuType == 'menu'">
        <el-input v-model="form.component" :placeholder="this.$t('table.menupath')" style="width: 460px;"/>
      </el-form-item>
      <el-form-item v-if="isAdd" :label="this.$t('table.supercategory')">
        <treeselect v-model="form.parentId" :load-options="loadOptions" :options="menus" style="width: 460px;"
                    :placeholder="this.$t('table.selectsupercategory')"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">
        {{ $t('btn.cancel') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">
        {{ $t('btn.comfirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {nacosServices } from '@/api/app'
  import {isOverLength} from '@/utils/validate'
  import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
  import {initData} from '@/api/data'
  import {add, edit} from '@/api/menu'
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from '@/components/IconSelect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {filterlist} from '@/utils/treeselectdata'

  export default {
    components: {Treeselect, IconSelect},
    props: {
      isMenu: {
        type: Boolean,
        required: true
      },
      isAdd: {
        type: Boolean,
        required: true
      },
      sup_this: {
        type: Object,
        default: null
      }
    },
    data() {
      const validResourceName = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('table.penterresourcename')))
        } else if (!isOverLength(value)) {
          callback(new Error(this.$t('table.penter1_20bitresourcename')))
        } else {
          callback()
        }
      }
      return {
        loading: false, dialog: false, menus: [],
        method: [{'value': 'GET', 'label': 'GET'}, {'value': 'POST', 'label': 'POST'}, {
          'value': 'PUT',
          'label': 'PUT'
        }, {'value': 'DELETE', 'label': 'DELETE'}],
        menuType: [{'value': 'menu', 'label': this.$t('table.menu')}, {'value': 'uri', 'label': '页面'}, {
          'value': 'btn',
          'label': this.$t('table.button')
        }, {'value': 'api', 'label': this.$t('table.port')}],
        form: {
          name: '',
          ordNum: 999,
          href: '',
          component: '',
          code: '',
          icon: '',
          enName: null,
          menuType: '',
          serviceId: null,
          scop: '',
          permissionCode: '',
          method: '',
          isShow: null,
          isDisable: null,
        },
          services:[],
        rules: {
          name: [
            {required: true, trigger: 'blur',validator:validResourceName}
          ],
          ordNum: [
            {required: true, message: this.$t('table.penterserialnumber'), trigger: 'blur', type: 'number'}
          ],
          menuType: [
            {required:true,message:this.$t('table.pselectresourcetype'),trigger:'blur'}
            ],
          method:[
            {required:true,message:this.$t('table.pselectrequesttype'),trigger:'blur'}
          ],
          href:[
            {required:true,message:this.$t('table.penterresourcepath'),trigger:'blur'}
          ],
          serviceId:[
            {required:true,message:this.$t('table.pselectbelongtoserver'),trigger:'blur'}
          ]
        }
      }
    },
    methods: {
      cancel() {
        if(this.isAdd){
          this.dialog = false
          return
        } else {
          this.resetForm()
        }
        
      },
      doSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            return false
          }
        })
      },
      doAdd() {
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: this.$t('table.addsuccess'),
            type: 'success',
            duration: 2500
          })
          this.$router.replace({
            path: this.$router.path,
            query: {
              t: Date.now()
            }
          })
        }).catch(err => {
          this.loading = false
        })
      },
      doEdit() {
        edit(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: this.$t('table.modifysuccess'),
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$router.replace({
            path: this.$router.path,
            query: {
              t: Date.now()
            }
          })
        }).catch(err => {
          this.loading = false
        })
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.form = {
          name: '',
          ordNum: 999,
          href: '',
          component: '',
          code: '',
          icon: '',
          enName: '',
          menuType: '',
          serviceId: null,
          scop: '',
          permissionCode: '',
          method: '',
          isShow: null,
          isDisable: null,
          pid: 0
        }
      },
      selected(name) {
        this.form.icon = name
      },
      getMenus() {
        initData('cloud-admin/resource/list').then(res => {
          this.menus = filterlist(res)
        })
      },
      getNacosService() {
        var _this = this
        // initData('cloud-admin/nacos/nacosServices').then(res=>{
        //   _this.services = []
        //   console.log(res)
        //   res.data.forEach(service => {
        //     _this.services.push({ id: service,label: service })
        //   })
        // })

        // debugger
        nacosServices().then(res => {
          _this.services = []
          res.data.data.forEach(service => {
            _this.services.push({ id: service,label: service })
          })
        })
      },
      loadOptions({action, parentNode, callback}) {
        // Typically, do the AJAX stuff here.
        // Once the server has responded,
        // assign children options to the parent node & call the callback.
        if (action === LOAD_CHILDREN_OPTIONS) {
          initData('cloud-admin/resource/list', {parentId: parentNode.id}).then(res => {
            parentNode.children = filterlist(res)
            callback()
            if (parentNode.id) {
              this.form.parentId = parentNode.id
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
