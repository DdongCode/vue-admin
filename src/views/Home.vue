<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{ collapsed ? '' : sysName }}
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar"/> {{ sysUserName }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo"
                 unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in AllRoutes" v-if="!item.hidden">
            <!--非叶子结点，有子菜单-->
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                <i :class="child.icon"></i>{{ child.name }}
              </el-menu-item>
            </el-submenu>
            <!--叶子结点，无子菜单-->
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i
                :class="item.icon"></i>{{ item.children[0].name }}
            </el-menu-item>
          </template>
        </el-menu>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{ $route.name }}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>

import {requestLogout} from '../api/api'
import {UserInfoRequest} from '../api/user'
export default {
  data() {
    return {
      sysName: '图书漂流管理系统',
      collapsed: false,
      sysUserName: '',
      sysUserAvatar: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
        //退出登录
    logout(){
      let _this = this;
      this.$confirm('确认退出吗?', '提示', {
      }).then(() => {
        requestLogout().then(data=>{
          let {msg, code} = data;
          if (code === 200) {
            this.$message({
              message: msg,
              type: 'success'
            });
            //清除用户token
            sessionStorage.removeItem('user');
            //清除动态路由
            _this.$store.dispatch('clear_d_routes')
            _this.$router.push('/login/login');
          }
        })
      }).catch(() => {

      });
    }
  },
  mounted() {
    let token = sessionStorage.getItem('user');
    if (token) {
      this.sysUserAvatar = 'https://yu-yx.oss-cn-qingdao.aliyuncs.com/image/2020/7/17/24c1df26-a056-4b5e-8a98-22fd28a25938.jpeg';
      //获取用户信息
      UserInfoRequest().then(data =>{
        let {code,msg,userInfo} = data
        if (code === 200){
          this.sysUserName = userInfo.username
        }else {
          this.$message({
            message:msg,
            type: 'error'
          })
        }
      })
    }
  },
  computed:{
    AllRoutes(){
      return [...this.$router.options.routes,...this.$store.getters.getDRoutes]
    }
  }
}

</script>

<style scoped lang="scss">
@import '~scss_vars';

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;

    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;

      .userinfo-inner {
        cursor: pointer;
        color: #fff;

        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }

    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;

      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }

      .txt {
        color: #fff;
      }
    }

    .logo-width {
      width: 230px;
    }

    .logo-collapse-width {
      width: 60px
    }

    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }

  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;

    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }

      .collapsed {
        width: 60px;

        .item {
          position: relative;
        }

        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }

      }
    }

    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }

    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }

    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;

      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }

        .breadcrumb-inner {
          float: right;
        }
      }

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
