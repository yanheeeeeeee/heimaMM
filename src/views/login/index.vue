<template>
  <div id="login">
    <div id="loginBar">
      <el-form ref="form" :model="form">
        <el-row>
          <el-col :span="24">
            <img src="../../assets/images/logo.png" alt />
            <span>黑马面面</span>
            <span>|</span>
            <span>用户登录</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-input placeholder="请输入手机号" v-model="form.username" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-input placeholder="请输入密码" v-model="form.password" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item>
              <el-input placeholder="请输入验证码" prefix-icon="el-icon-key"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="onSubmit">登 录</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="onSubmit">注 册</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <img src="./images/login_banner_ele.png" alt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

<style lang="less">
#login {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  display: flex;
  justify-content: space-around;
  align-items: center;

  #loginBar {
    width: 478px;
    height: 550px;
    background: rgba(245, 245, 245, 1);
    padding: 43px;

    .el-row {
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 0;
      }

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>