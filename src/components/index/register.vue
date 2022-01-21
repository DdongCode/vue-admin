<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">图书漂流管理系统</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="confirmPwd">
      <el-input type="password" v-model="ruleForm2.confirmPwd" auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item prop="real_name">
      <el-input type="text" v-model="ruleForm2.realName" auto-complete="off" placeholder="真实姓名"></el-input>
    </el-form-item>
    <el-form-item prop="telephone">
      <el-input type="text" v-model="ruleForm2.telephone" auto-complete="off" placeholder="电话号码"></el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input type="text" v-model="ruleForm2.email" auto-complete="off" placeholder="电子邮箱"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button style="width: 45%" @click.native.prevent="gotoLogin">登录</el-button>
      <el-button type="primary" style="width: 45%" @click.native.prevent="handleSubmit2" :loading="loading">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {requestRegister} from '../../api/api';
export default {
  name:'register',
  data() {
    let validateConfirmPwd = (rule, value, callback) => {
       if (this.ruleForm2.password !== value) {
        callback(new Error('确认密码与新密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm2: {
        username: '',
        password: '',
        confirmPwd:'',
        realName:'',
        telephone:'',
        email:''
      },
      rules2: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validateConfirmPwd, trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    gotoLogin() {
      this.$router.push("/login/login")
    },
    handleSubmit2() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.loading = true
          //发送请求注册
          requestRegister(this.ruleForm2).then(data =>{
            this.loading = false
            let {code,msg} = data
            if (code !== 200){
              this.$message({
                message:msg,
                type:'error'
              })
            }else {
              this.ruleForm2={}
              this.$message({
                message:'注册成功，请登录',
                type:'success'
              })
              this.$router.push('/login/login');
            }
          })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
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
}
</style>
