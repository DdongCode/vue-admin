<template>
  <div>
    <div class="content">
      <el-tag type="danger" class="tips">此功能面向开发者使用，非开发人员勿动，若因操作失误导致系统崩溃，请联系开发者</el-tag>
    </div>
    <el-card>
      <div slot="header">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addModule">添加模块</el-button>
      </div>
      <el-tree
          :data="TreeData"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
          ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span class="action">
          <el-button type="text" @click="addMenu(data.id)" v-if="node.level === 1">添加子菜单</el-button>
          <el-button type="text" @click="addButton(data.id)" v-if="node.level === 2">添加按钮</el-button>
          <el-button type="text" @click="edit(node.level,data)">修改</el-button>
          <el-button type="text" @click="doDel(data)">删除</el-button>
        </span>
      </span>
      </el-tree>
    </el-card>


    <!--操作模块-->
    <el-dialog :title="formOneTitle" :visible.sync="dialogFormOneVisible" width="30%">
      <el-form :model="Form1" :rules="rules1" ref="rules1" label-width="100px">
        <el-form-item prop="name" label="模块名称">
          <el-input type="text" v-model="Form1.name" auto-complete="off" placeholder="模块名称"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="模块图标">
          <el-input type="text" v-model="Form1.icon" auto-complete="off" placeholder="模块图标"></el-input>
          <el-input type="hidden" v-model="Form1.type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelFormOne">取 消</el-button>
        <el-button type="primary" @click="handleConfirmFormOne" :loading="commitOneLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--操作菜单-->
    <el-dialog :title="formTwoTitle" :visible.sync="dialogFormTwoVisible" width="30%">
      <el-form :model="Form2" :rules="rules2" ref="rules2" label-width="100px">
        <el-form-item prop="name" label="子菜单名称">
          <el-input type="text" v-model="Form2.name" auto-complete="off" placeholder="子菜单名称"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标">
          <el-input type="text" v-model="Form2.icon" auto-complete="off" placeholder="菜单图标"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="菜单路径">
          <el-input type="text" v-model="Form2.path" auto-complete="off" placeholder="菜单路径"></el-input>
        </el-form-item>
        <el-form-item prop="component" label="菜单组件">
          <el-input type="text" v-model="Form2.component" auto-complete="off"
                    placeholder="菜单组件，路径从components起始"></el-input>
          <el-input type="hidden" v-model="Form2.type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelFormTwo">取 消</el-button>
        <el-button type="primary" @click="handleConfirmFormTwo" :loading="commitTwoLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--操作按钮-->
    <el-dialog :title="formThreeTitle" :visible.sync="dialogFormThreeVisible" width="30%">
      <el-form :model="Form3" :rules="rules3" ref="rules3" label-width="100px">
        <el-form-item prop="name" label="按钮名称">
          <el-input type="text" v-model="Form3.name" auto-complete="off" placeholder="按钮名称"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="请求路径">
          <el-input type="text" v-model="Form3.path" auto-complete="off" placeholder="请求路径"></el-input>
        </el-form-item>
        <el-form-item prop="permissionValue" label="权限值">
          <el-input type="text" v-model="Form3.permissionValue" auto-complete="off" placeholder="权限值"></el-input>
          <el-input type="hidden" v-model="Form3.type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelFormThree">取 消</el-button>
        <el-button type="primary" @click="handleConfirmFormThree" :loading="commitThreeLoading">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import {PermissionTreeRequest, PermissionAddOrEditRequest, PermissionDelRequest} from '../../api/permissionApi'

export default {
  name: "permissionTable",
  data() {
    return {
      TreeData: [],
      //表单一
      Form1: {
        name: '',
        icon: '',
        type: 1
      },
      rules1: {
        name: [
          {required: true, message: '请输入模块名称', trigger: 'blur'},
        ],
        icon: [
          {required: true, message: '请输入模块图标', trigger: 'blur'},
        ],
      },
      formOneTitle: '添加模块',
      dialogFormOneVisible: false,
      commitOneLoading: false,
      //表单2
      Form2: {
        name: '',
        icon: '',
        path: '',
        component: '',
        type: 1
      },
      rules2: {
        name: [
          {required: true, message: '请输入子菜单名称', trigger: 'blur'},
        ],
        icon: [
          {required: true, message: '请输入菜单图标', trigger: 'blur'},
        ],
        path: [
          {required: true, message: '请输入菜单路径', trigger: 'blur'},
        ],
        component: [
          {required: true, message: '请输入组件路径', trigger: 'blur'},
        ],
      },
      formTwoTitle: '添加子菜单',
      dialogFormTwoVisible: false,
      commitTwoLoading: false,

      //表单3
      Form3: {
        name: '',
        path: '',
        permissionValue: '',
        type: 2
      },
      rules3: {
        name: [
          {required: true, message: '请输入按钮名称', trigger: 'blur'},
        ],
        path: [
          {required: true, message: '请输入请求路径', trigger: 'blur'},
        ],
        permissionValue: [
          {required: true, message: '请输入权限值', trigger: 'blur'},
        ],
      },
      formThreeTitle: '添加按钮',
      dialogFormThreeVisible: false,
      commitThreeLoading: false,

      parent_id: ''
    }
  },
  methods: {
    loadData() {
      PermissionTreeRequest().then(data => {
        this.TreeData = data.permissionsTree
      })
    },
    //操作模块
    addModule() {
      this.formOneTitle = '添加模块'
      this.dialogFormOneVisible = true
    },
    handleCancelFormOne() {
      this.Form1 = {}
      this.dialogFormOneVisible = false
      this.loadData()
    },
    handleConfirmFormOne() {
      this.$refs.rules1.validate((valid) => {
        if (valid) {
          this.commitOneLoading = true
          let formData = {
            ...this.Form1
          }
          formData.type = 1
          PermissionAddOrEditRequest(formData).then(data => {
            this.commitOneLoading = false
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: '错误',
                type: 'error'
              })
            }
            this.handleCancelFormOne()
          })
        } else {
          return false;
        }
      });
    },
    //操作菜单
    addMenu(pid) {
      this.parent_id = pid
      this.formTwoTitle = '添加菜单'
      this.dialogFormTwoVisible = true
    },
    handleCancelFormTwo() {
      this.Form2 = {}
      this.parent_id = ''
      this.dialogFormTwoVisible = false
      this.loadData()
    },
    handleConfirmFormTwo() {
      this.$refs.rules2.validate((valid) => {
        if (valid) {
          this.commitTwoLoading = true
          let formData = {
            ...this.Form2
          }
          formData.type = 1
          if (this.parent_id) {
            formData.parentId = this.parent_id
          }
          PermissionAddOrEditRequest(formData).then(data => {
            this.commitTwoLoading = false
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: '错误',
                type: 'error'
              })
            }
            this.handleCancelFormTwo()
          })
        } else {
          return false;
        }
      });
    },
    //操作按钮
    addButton(pid) {
      this.parent_id = pid
      this.formThreeTitle = '添加按钮'
      this.dialogFormThreeVisible = true
    },
    handleCancelFormThree() {
      this.parent_id = ''
      this.Form3 = {}
      this.dialogFormThreeVisible = false
      this.loadData()
    },
    handleConfirmFormThree() {
      this.$refs.rules3.validate((valid) => {
        if (valid) {
          this.commitThreeLoading = true
          let formData = {
            ...this.Form3
          }
          formData.type = 2
          if (this.parent_id) {
            formData.parentId = this.parent_id
          }
          PermissionAddOrEditRequest(formData).then(data => {
            this.commitThreeLoading = false
            if (data.code === 200) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: '错误',
                type: 'error'
              })
            }
            this.handleCancelFormThree()
          })
        } else {
          return false;
        }
      });
    },
    edit(level, data) {
      if (level === 1) {
        this.formOneTitle = '编辑模块'
        this.Form1 = data
        this.dialogFormOneVisible = true
      }
      if (level === 2) {
        this.formTwoTitle = '编辑子菜单'
        this.Form2 = data
        this.dialogFormTwoVisible = true
      }
      if (level === 3) {
        this.formThreeTitle = '编辑按钮'
        this.Form3 = data
        this.dialogFormThreeVisible = true
      }
    },
    doDel(data) {
      if (data.children && data.children.length !== 0) {
        this.$message({
          message: '存在子权限，不能删除！',
          type: 'error'
        })
      } else {
        let param = {
          permissionId: data.id
        }
        this.$confirm("您清楚后果并确认删除吗？", "提示", {}).then(() => {
              PermissionDelRequest(param).then(data => {
                let {code, msg} = data
                if (code === 200) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: msg,
                    type: 'error'
                  })
                }
                this.loadData()
              })
            }
        ).catch(() => {
        })
      }
    }
  },
  computed: {
    defaultExpandedKeys() {
      let ExpandedKeys = []
      this.TreeData.forEach((e) => {
        ExpandedKeys.push(e.id)
      })
      return ExpandedKeys
    },

  },
  mounted() {
    this.loadData()
  }

}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.action {
  padding-left: 100px;
}

.tips {
  margin-top: 30px;
  margin-bottom: 10px;
}

.content {
  text-align: center;
}
</style>
