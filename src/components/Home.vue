<template>
  <el-container class="home-container">
    <!-- 头部-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 侧边栏菜单区-->
        <!-- 折叠按钮-->
        <div class="togle-btn" @click="togleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened
         :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconFont[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
            @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        //侧边栏菜单区数据
        menuList: [],
        //菜单图标
        iconFont: {
          '125': 'el-icon-user-solid',
          '103': 'el-icon-info',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-platform'
        },
        // 判断折叠状态
        isCollapse: false,
        // 被激活的路由地址
        activePath:''
      }
    },
    methods: {
      //退出登录
      loginOut() {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      },
      //获取侧边栏菜单区数据
      async getMenuList() {
        const {
          data: res
        } = await this.$axios.get('menus')
        //console.log(res)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data
      },
     togleCollapse(){
      this.isCollapse = !this.isCollapse
     },
     saveNavState(activePath){
      this.activePath = activePath
      window.sessionStorage.setItem('activePath',activePath)
     }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style lang="less" scoped="scoped">
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;
      
      img {
        width: 40px;
        height: 40px;
      }

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }
  .togle-btn{
    color: white;
    letter-spacing: 0.2em;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    cursor: pointer;
    background-color: #4a5064;
  }
  .el-main {
    background-color: #eaedf1;
  }
</style>
