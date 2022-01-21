<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="输入用户名筛选"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUser">查询</el-button>
          <el-button type="primary" v-on:click="reset">重置</el-button>
          <el-button type="primary" v-on:click="toAddUser" v-if="hasPermission('user_add')">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <template>
      <el-table :data="users" border highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column type="index" label="序号" width="120">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="160" sortable>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="200" sortable>
        </el-table-column>
        <el-table-column prop="telephone" label="电话号码" width="160" sortable>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="260" sortable>
        </el-table-column>
        <el-table-column label="状态" min-width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status">有效</el-tag>
            <el-tag type="danger" v-if="!scope.row.status">挂失</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="light" v-if="hasPermission('user_edit')">
              <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="editUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" effect="light" v-if="hasPermission('user_assign_roles')">
              <el-button type="success" size="mini" icon="el-icon-menu" circle
                         @click="AssigningRoles(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="light" v-if="hasPermission('user_del')">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                         @click="DelUser(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="80px">
        <el-form-item prop="username" label="账号">
          <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="isAddUer" label="密码">
          <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" v-if="isAddUer" label="确认密码">
          <el-input type="password" v-model="ruleForm2.confirmPwd" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item prop="real_name" label="真实姓名">
          <el-input type="text" v-model="ruleForm2.realName" auto-complete="off" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="telephone" label="电话号码">
          <el-input type="text" v-model="ruleForm2.telephone" auto-complete="off" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱">
          <el-input type="text" v-model="ruleForm2.email" auto-complete="off" placeholder="电子邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="是否有效" v-if="!isAddUer">
          <el-switch v-model="ruleForm2.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="commitLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible" width="30%">
      <el-checkbox-group v-model="checkRoles">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id"> {{ role.roleName }}</el-checkbox>
      </el-checkbox-group>
      <el-button @click="CancelAssigning">取 消</el-button>
      <el-button type="primary" @click="ConfirmAssigning" :loading="AssigningLoading">确 定</el-button>
    </el-dialog>

  </section>
</template>
<script>
import {UserListRequest, UserAddRequest, UserEditRequest, UserDelRequest, AssigningRolesRequest} from '../../api/user';
import {RoleGetRequest, RoleAllRequest} from '../../api/role';

export default {
  data() {
    let validateConfirmPwd = (rule, value, callback) => {
      if (this.ruleForm2.password !== value) {
        callback(new Error('确认密码与新密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      filters: {
        name: ''
      },
      loading: false,
      commitLoading: false,
      AssigningLoading: false,
      users: [],
      dialogFormVisible: false,
      dialogRoleVisible: false,
      isAddUer: true,
      formTitle: '添加用户',
      ruleForm2: {
        username: '',
        password: '',
        confirmPwd: '',
        realName: '',
        telephone: '',
        email: ''
      },
      rules2: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        confirmPwd: [
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          {validator: validateConfirmPwd, trigger: 'blur'}
        ]
      },
      roleList: [],
      checkRoles: [],
      checkUser: ''
    }
  },
  methods: {
    //重置筛选
    reset() {
      this.filters.name = ''
      this.getUser()
    },
    //获取用户列表
    getUser() {
      let para = {
        name: this.filters.name
      };
      this.loading = true;
      UserListRequest(para).then((data) => {
        this.users = data.result;
        this.loading = false;
      });
    },
    //打开新增用户窗口
    toAddUser() {
      this.formTitle = '新增用户'
      this.isAddUer = true
      this.dialogFormVisible = true
    },
    //取消新增/编辑用户
    handleCancel() {
      this.ruleForm2 = {}
      this.dialogFormVisible = false
    },
    //打开编辑用户窗口
    editUser(user) {
      console.log(user)
      this.formTitle = '编辑用户'
      this.isAddUer = false
      this.ruleForm2 = user
      this.dialogFormVisible = true
    },
    //确认添加/编辑用户
    handleConfirm() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.commitLoading = true
          if (this.isAddUer) { //添加用户
            UserAddRequest(this.ruleForm2).then(data => {
              this.commitLoading = false
              if (data.code === 200) {
                this.$message({
                  message: "添加成功",
                  type: 'success'
                })
                this.commitLoading = false
                this.handleCancel()
                this.getUser()
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                })
                this.commitLoading = false
              }
            })
          } else {   //编辑用户
            UserEditRequest(this.ruleForm2).then(data => {
              this.commitLoading = false
              if (data.code === 200) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.commitLoading = false
                this.handleCancel()
                this.getUser()
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
    //删除用户
    DelUser(userId) {
      const _this = this
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        let param = {
          userId: userId
        }
        UserDelRequest(param).then(data => {
          let {code, msg} = data
          if (code === 200) {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getUser()
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
    //打开分配角色窗口
    AssigningRoles(userId) {
      this.checkUser = userId
      let params = {
        userId: userId
      }
      RoleGetRequest(params).then(data => {
        this.checkRoles = data.userRoles
        this.dialogRoleVisible = true
      })
    },
    //取消分配角色
    CancelAssigning() {
      this.dialogRoleVisible = false
      this.checkRoles = []
      this.checkUser = ''
    },
    //确认分配角色
    ConfirmAssigning() {
      this.AssigningLoading = true
      AssigningRolesRequest(this.checkUser, this.checkRoles.toString()).then(data => {
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
    }
  },
  computed: {},
  mounted() {
    this.getUser();
    RoleAllRequest().then(data => {
      this.roleList = data.roleList
    })
  }
};
</script>

<style scoped>
</style>

