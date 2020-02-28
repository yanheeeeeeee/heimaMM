<template>
  <el-container id="index">
    <!-- 头部部分 -->
    <el-header class="indexHeader">
      <!-- 左侧 -->
      <div id="leftHeader">
        <!-- 菜单折叠点击事件 -->
        <i :class="isCollapse? 'el-icon-s-unfold':'el-icon-s-fold'" @click="isCollapse=!isCollapse"></i>
        <img src="@/assets/images/logo.png" width="32px" />
        <span>黑马面面</span>
      </div>
      <!-- 右侧 -->
      <div id="rightHeader">
        <img :src="avatar" alt width="40px" />
        <span>{{username}},你好</span>

        <el-button type="primary" size="mini" @click="open" slot="reference">退出</el-button>
      </div>
    </el-header>
    <!-- 主题部分 -->
    <el-container>
      <!-- 侧边栏部分 -->
      <el-aside width="auto">
        <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse" router>
          <el-menu-item index="/index/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据概览</span>
          </el-menu-item>
          <el-menu-item index="/index/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>

          <el-menu-item index="/index/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>

          <el-menu-item index="/index/business">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>

          <el-menu-item index="/index/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主题部分 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { logout } from "@/api/index.js";
import { getToken } from "@/utilis/token.js";
export default {
  data() {
    return {
      username: "",
      avatar: "",
      isCollapse: false
    };
  },
  methods: {
    open() {
      // this.$confirm this.$alert this.$prompt
      this.$confirm("确认要退出登录吗?", "确认操作", {
        confirmButtonText: "确定",
        cancelButtomText: "取消",
        type: "warning"
      }).then(() => {
        logout().then(() => {
          // 退出时清空store里的用户信息
          this.$store.commit("setUsername", "");
          this.$store.commit("setAvatar", "");

          this.$message.success("退出成功");
          this.$router.push("/login");
        });
      });
      // .catch(() => {
      //   this.$message.success("什么都没有发生");
      // });
    }
  },
  created() {
    // 从vuex中取出username和avatar
    this.username = this.$store.state.username;
    this.avatar = this.$store.state.avatar;
  },
  beforeCreate() {
    if (getToken() == null) {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less">
#index {
  height: 100%;
}
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
  box-shadow: 0px 2px 5px 0px rgba(63, 63, 63, 0.35);
}

.el-aside {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 200px;

  .el-menu {
    border: none;
  }
}

.el-container .el-main {
  background-color: #e8e9ec;
  color: #333;
  text-align: center;
}
.indexHeader {
  display: flex;
  justify-content: space-between;

  #leftHeader {
    font-size: 22px;
    display: flex;
    align-items: center;

    i {
      font-size: 26px;
      margin-right: 20px;
    }
    span {
      color: #49a1ff;
      margin-left: 12px;
    }
  }

  #rightHeader {
    font-size: 14px;
    display: flex;
    align-items: center;

    .el-button {
      margin: 0 20px 0 38px;
    }

    img {
      margin-right: 9px;
    }
  }
}
// 该样式是折叠动画更加顺滑
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>