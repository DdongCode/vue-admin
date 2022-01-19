<template>
  <el-form :model="userForm" :rules="rules" ref="userForm" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">图书漂流管理系统</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="userForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="userForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button style="width: 45%" @click.native.prevent="gotoRegister">注册</el-button>
      <el-button type="primary" style="width: 45%" @click.native.prevent="handleSubmit" :loading="loading">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {requestLogin} from '../../api/api';
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      userForm: {
        account: 'admin',
        checkPass: '123456'
      },
      rules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        checkPass: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ]
      },
      checked: true
    };
  },
  methods: {
    gotoRegister() {
      this.$router.push("/login/register")
    },
    handleSubmit() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let loginParams = {username: this.userForm.account, password: this.userForm.checkPass};
          requestLogin(loginParams).then(data => {
            this.loading = false;
            let {msg, code, token} = data;
            if (code !== 200) {
              this.$message({
                message: msg,
                type: 'error'
              });
            } else {
              sessionStorage.setItem('user', token);
              this.$router.push('/main');
            }
          });
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
