<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" v-on:click="toAddRole" v-if="hasPermission('role_add')">新增角色</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="roles" border highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column type="index" label="序号" width="120">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300" sortable>
        </el-table-column>
        <el-table-column prop="roleDescription" label="角色描述" width="400" sortable>
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="light" v-if="hasPermission('role_edit')">
              <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="editRole(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配权限" placement="top" effect="light" v-if="hasPermission('role_assign_permissions')">
              <el-button type="success" size="mini" icon="el-icon-menu" circle
                         @click="AssigningPermissions(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="light" v-if="hasPermission('role_del')">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                         @click="DelRole(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="80px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input type="text" v-model="ruleForm2.roleName" auto-complete="off" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item prop="roleDescription" label="角色描述">
          <el-input type="text" v-model="ruleForm2.roleDescription" auto-complete="off" placeholder="角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="commitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="dialogRoleVisible" width="30%">
      <el-tree
          :data="permissionsTree"
          show-checkbox
          check-strictly
          :default-expanded-keys="defaultExpandedKeys"
          node-key="id"
          ref="tree"
          highlight-current
          @check="checkHandle"
          :props="defaultProps">
      </el-tree>

      <el-button @click="CancelAssigning">取 消</el-button>
      <el-button type="primary" @click="ConfirmAssigning" :loading="AssigningLoading">确 定</el-button>
    </el-dialog>

  </section>
</template>
<script>
import {
  RoleAllRequest,
  RoleAddRequest,
  RoleEditRequest,
  RoleDelRequest,
  AssigningPermissionsRequest
} from '../../api/role';
import {PermissionGetRequest, PermissionTreeRequest} from '../../api/permissionApi'

export default {
  data() {
    return {
      loading: false,
      commitLoading: false,
      AssigningLoading: false,
      roles: [],
      dialogFormVisible: false,
      dialogRoleVisible: false,
      isAddRole: true,
      formTitle: '添加角色',
      ruleForm2: {
        roleName: '',
        roleDescription: '',
      },
      rules2: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ],
        roleDescription: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
        ],
      },
      permissionsTree: [],
      checkPermissions: [],
      checkRole: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed:{
    defaultExpandedKeys(){
      let ExpandedKeys = []
      this.permissionsTree.forEach((e)=>{
        ExpandedKeys.push(e.id)
      })
      return ExpandedKeys
    }
  },
  methods: {
    //获取角色列表
    getRole() {
      this.loading = true;
      RoleAllRequest().then((data) => {
        this.roles = data.roleList;
        this.loading = false;
      });
    },
    //打开新增角色窗口
    toAddRole() {
      this.formTitle = '新增角色'
      this.isAddRole = true
      this.dialogFormVisible = true
    },
    //取消新增/编辑角色
    handleCancel() {
      this.ruleForm2 = {}
      this.dialogFormVisible = false
    },
    //打开编辑角色窗口
    editRole(user) {
      this.formTitle = '编辑角色'
      this.isAddRole = false
      this.ruleForm2 = user
      this.dialogFormVisible = true
    },
    //确认添加/编辑角色
    handleConfirm() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.commitLoading = true
          if (this.isAddRole) { //添加角色
            RoleAddRequest(this.ruleForm2).then(data => {
              this.commitLoading = false
              if (data.code === 200) {
                this.$message({
                  message: "添加成功",
                  type: 'success'
                })
                this.commitLoading = false
                this.handleCancel()
                this.getRole()
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
                this.commitLoading = false
              }
            })
          } else {   //编辑角色
            RoleEditRequest(this.ruleForm2).then(data => {
              this.commitLoading = false
              if (data.code === 200) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.commitLoading = false
                this.handleCancel()
                this.getRole()
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
                this.commitLoading = false
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    //删除角色
    DelRole(roleId) {
      const _this = this
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        let param = {
          roleId: roleId
        }
        RoleDelRequest(param).then(data => {
          let {code, msg} = data
          if (code === 200) {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getRole()
          } else {
            _this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
      });
    },
    //打开分配权限窗口
    AssigningPermissions(roleId) {
      this.checkRole = roleId
      let params = {
        roleId: roleId
      }
      PermissionGetRequest(params).then(data => {
        this.checkPermissions = data.rolePermissions
        this.dialogRoleVisible = true
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.checkPermissions)
        });

      })
    },
    //取消分配角色
    CancelAssigning() {
      this.dialogRoleVisible = false
      this.checkPermissions = []
      this.checkRole = ''
    },
    //确认分配权限
    ConfirmAssigning() {
      this.AssigningLoading = true
      let checked = this.$refs.tree.getCheckedKeys()
      AssigningPermissionsRequest(this.checkRole, checked.toString()).then(data => {
        this.AssigningLoading = false
        if (data.code === 200) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: data.msg,
            type: 'error'
          })
        }
        this.CancelAssigning()
      })
    },
    /**
     * 获取不重复的已选中父节点结点
     * @param checked 选中的结点keys
     * @returns {*[]}
     */
    getDistinctParentKeys(checked) {
      let parnt = []
      let cache = []
      for (let i = 0; i < checked.length; i++) {
        if (cache.indexOf(checked[i]) === -1) {
          cache.push(checked[i])
          parnt.push(checked[i])
        }
        let p = this.$refs.tree.getNode(checked[i]).parent
        if (p && cache.indexOf(p.data.id) === -1) {
          cache.push(p.data.id)
          parnt.push(p.data.id)
          let pp = p.parent
          if (pp && cache.indexOf(pp.data.id) === -1) {
            cache.push(pp.data.id)
            parnt.push(pp.data.id)
          }
        }

      }
      return parnt
    },
    //当复选框被点击的时候触发
    checkHandle(value, status) {
      //当前点击的节点key
      let self = value.id

      //当前树的选中情况
      let checked = status.checkedKeys

      let child = this.getChildrenKeys(value.id)
      let parent = this.getDistinctParentKeys(checked)

      //子节点全选中时，点击当前节点将全部子节点设为未选中
      if (this.isContained(checked, child)) {
        this.setUnCheck(child)
      } else {    //子节点未全选中，选中所有子节点、自身、自身父节点以及当前树的选中节点
        this.$refs.tree.setCheckedKeys([...parent,...checked,...child,...self])
      }
    },
    /**
     * 获取父节点所有子节点keys
     * @param parent_id 父节点id
     * @returns {*[]}
     */
    getChildrenKeys(parent_id) {
      let result = []
      let child = this.$refs.tree.getNode(parent_id).data.children
      if (child && child.length) {
        for (let i = 0; i < child.length; i++) {
          result.push(child[i].id)
          let ids = this.getChildrenKeys(this.$refs.tree.getNode(child[i].id).data)
          result = [...result, ...ids]
        }
      }
      return result
    },
    /**
     * 将结点设为未选中状态
     * @param keys 预设值的结点keys
     */
    setUnCheck(keys) {
      for (let i = 0; i < keys.length; i++) {
        this.$refs.tree.getNode(keys[i]).checked = false
      }
    },
    //判断a数组是否包含b数组
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      if (a.length < b.length) return false;
      var aStr = a.toString();
      for (var i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) return false;
      }
      return true;
    }
  },
  mounted() {
    this.getRole();
    PermissionTreeRequest().then(data => {
      this.permissionsTree = data.permissionsTree
    })
  }
};
</script>

<style scoped>
</style>

