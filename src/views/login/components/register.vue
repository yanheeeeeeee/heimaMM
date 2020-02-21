<template>
  <!-- 注册模块Form -->
  <el-dialog
    title="用户注册"
    :visible.sync="dialogFormVisible"
    center
    width="603px"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <!-- 昵称 -->
    <el-form :model="regForm" :rules="rules" ref="regForm">
      <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
        <el-input v-model="regForm.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="regForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 手机 -->
      <el-form-item label="手机" :label-width="formLabelWidth" prop="pboneNum">
        <el-input v-model="regForm.pboneNum" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="regForm.password" autocomplete="off" type="password"></el-input>
      </el-form-item>
      <!-- 图形码 -->
      <el-row>
        <el-col :span="16">
          <el-form-item label="图形码" :label-width="formLabelWidth" prop="imgCode">
            <el-input v-model="regForm.imgCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <img :src="picCodeUrl" alt width="100%" @click="getNewCode" />
        </el-col>
      </el-row>
      <!-- 验证码 -->
      <el-row>
        <el-col :span="16">
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="msgCode">
            <el-input v-model="regForm.msgCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <!-- 当sec=0时, 按钮不可用,并且会显示一个倒计时 -->
          <el-button
            class="btnFull"
            @click="getMsgCode"
            :disabled="sec===0?false:true"
          >{{sec==0?"获取用户验证码":`${sec}秒后可重新发送`}}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm('regForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      picCodeUrl:
        process.env.VUE_APP_URL + "/captcha?type=sendsms&lol" + Date.now(),
      regForm: {
        nickname: "",
        email: "",
        pboneNum: "",
        password: "",
        imgCode: "",
        msgCode: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "65px",
      isBan: false,
      sec: 0,
      rules: {
        nickname: [
          // reqiured: 必须的要填写的内容
          // min: 最小长度
          // max: 最大长度
          // message: 不符合这条规则的时候弹出的消息
          // trigger: 判断规则是否通过的时机. blur代表失去焦点
          // type: 类型
          // pattern: 正则表达式
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          },
          { min: 2, message: "昵称长度为2到10个字符", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur"
          },
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "请输入正确的邮箱格式",
            trigger: "blur"
          }
        ],
        pboneNum: [
          {
            required: true,
            message: "请输入您的手机号",
            trigger: "blur"
          },
          {
            pattern: /0?(13|14|15|18|17)[0-9]{9}/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入要使用的密码",
            trigger: "blur"
          },
          {
            min: 8,
            max: 64,
            message: "密码长度不能小于八位数",
            trigger: "blur"
          }
        ],
        imgCode: [
          {
            required: true,
            message: "请输入要图形验证码",
            trigger: "blur"
          }
        ],
        msgCode: [
          {
            required: true,
            message: "请输入短信验证码",
            trigger: "blur"
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
          this.dialogFormVisible = false;
        } else {
          alert("error submit!!");
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
    },
    getMsgCode() {
      // 点击后将倒计时sec设置为60
      this.sec = 60;
      // 创建一个计时器每隔1s触发一次sec--, 并判断sec是否为0, 为0则清除该计时器
      let timerID = setInterval(() => {
        this.sec--;
        if (this.sec === 0) {
          clearInterval(timerID);
        }
      }, 1000);

      // 获取短信验证码
      this.$axios({
        url: "/sendsms",
        method: "post",
        data: {
          code: this.regForm.imgCode,
          phone: this.regForm.pboneNum
        },
        // axios发送请求默认不会携带cookie, 由于此处有跨域,所以要修改默认设置
        withCredentials: true
      }).then(res => {
        //成功回调
        if (res.data.code == 200) {
          alert(`手机验证码为 ${res.data.data.captcha}`);
        } else if (res.data.code == 0) {
          alert("图形验证码错误,请重新输入.");
        } else {
          alert("获取验证码失败!");
        }
      });
    }
  }
};
</script>
<style lang="less">
.el-dialog__header {
  background: linear-gradient(to right, #29a7cf, #2b8de0);

  .el-dialog__title {
    font: 18px "microsoft yaHei";
    color: rgba(254, 254, 254, 1);
  }
}
.btnFull {
  width: 100%;
}
</style>