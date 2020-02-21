<template>
  <div id="login">
    <div id="loginBar">
      <!-- el-form 就是表单 要用到验证规则的时候需要加一个:rules="rules"属性-->
      <el-form ref="form" :model="form" :rules="rules">
        <el-row>
          <el-col :span="24" class="titleBox">
            <img src="../../assets/images/logo.png" alt />
            <span>黑马面面</span>
            <span></span>
            <span>用户登录</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!-- el-form-item 为表单元素 -->
            <!-- 表单使用规则的时候 需要写一个prop="规则名字",规则名字必须与双向绑定的属性名一致-->
            <el-form-item prop="phoneNum">
              <el-input placeholder="请输入手机号" v-model="form.phoneNum" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="password">
              <el-input
                placeholder="请输入密码"
                type="password"
                v-model="form.password"
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="codeBox">
          <el-col :span="16">
            <el-form-item prop="code">
              <el-input placeholder="请输入验证码" v-model="form.code" prefix-icon="el-icon-key"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <img :src="picCodeUrl" width="100%" alt @click="getNewCode" />
          </el-col>
        </el-row>
        <el-row class="compact">
          <el-col :span="24">
            <el-form-item prop="agree">
              <el-checkbox v-model="form.agree"></el-checkbox>我已阅读并同意
              <el-link type="primary">用户协议</el-link>和
              <el-link type="primary">隐私条款</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">登 录</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="$refs.register.dialogFormVisible = true">注 册</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <img src="./images/login_banner_ele.png" alt />

    <!-- 注册对话框 -->
    <register ref="register"></register>
  </div>
</template>

<script>
import register from "./components/register.vue";
export default {
  components: {
    register
  },
  data() {
    return {
      // 图形验证码的接口地址
      picCodeUrl:
        process.env.VUE_APP_URL + "/captcha?type=login&lol" + Date.now(),
      form: {
        phoneNum: "",
        password: "",
        code: "",
        agree: true
      },

      // 规则对象,写在data方法的return里面 里面写了所有的规则
      rules: {
        // 每个规则就是一个数组
        // name规则, 数据有两条, 就代表有2条规则需要遵守

        phoneNum: [
          // reqiured: 必须的要填写的内容
          // min: 最小长度
          // max: 最大长度
          // message: 不符合这条规则的时候弹出的消息
          // tigger: 判断规则是否通过的时机. blur代表失去焦点
          // type: 类型
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          { min: 11, max: 11, message: "长度在11个数字", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          { min: 8, max: 64, message: "密码不能小于8位数", trigger: "blur" }
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ],
        agree: [
          {
            required: true,
            pattern: /true/,
            message: "请先阅读并同意用户协议",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    getNewCode() {
      // 重新给picCodeUrl赋值
      // 用来解决请求缓存的方案:
      // 1.随机数:
      //   this.picCodeUrl = process.env.VUE_APP_URL + "/captcha?type=login&lol"+Math.random();
      // 2.时间戳(常用):
      this.picCodeUrl =
        process.env.VUE_APP_URL + "/captcha?type=login&lol" + Date.now();
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
    box-sizing: border-box;
    width: 478px;
    height: 550px;
    background: rgba(245, 245, 245, 1);
    padding: 43px;

    .el-row {
      margin-bottom: 25px;

      &:first-child {
        height: 28px;

        .titleBox {
          display: flex;
          align-items: center;
        }

        img {
          margin: 0 5px;
        }
        span {
          margin-left: 14px;

          &:nth-of-type(1) {
            font-size: 24px;
            font-family: SourceHanSansCN;
            font-weight: 400;
            color: rgba(12, 12, 12, 1);
          }
          &:nth-of-type(2) {
            width: 1px;
            height: 28px;
            background: rgba(199, 199, 199, 1);
          }
          &:nth-of-type(3) {
            font-size: 22px;
            font-family: SourceHanSansCN;
            font-weight: 400;
            color: rgba(12, 12, 12, 1);
          }
        }
      }
      &:nth-child(5) {
        height: 28px;
        color: #999999;
        padding-top: 5px;
      }
      &:last-child {
        margin-bottom: 0;
      }

      .el-button {
        width: 100%;
      }

      .el-checkbox {
        color: #999999;
      }

      .el-input {
        height: 44px;
      }
    }

    .codeBox {
      display: flex;
      align-items: center;
    }

    .compact {
      .el-col {
        display: flex;
        align-items: center;

        .el-form-item__content {
          line-height: 24px;

          .el-checkbox {
            margin-right: 10px;
          }
        }
      }
    }

    .el-form-item {
      margin: 0;
    }
  }
}
</style>