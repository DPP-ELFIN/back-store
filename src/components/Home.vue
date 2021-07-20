<template>
  <div class="home">
    <!-- 退出登录按钮 -->
    <el-button type="info" @click="loginOut">退出登录</el-button>
  </div>
</template>

<script>
  export default{
    methods:{
      //退出登录
      loginOut(){
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      }
    }
  }
</script>

<style>
</style>
