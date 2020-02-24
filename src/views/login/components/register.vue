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
    <el-form :model="regForm" :rules="rules" ref="regForm">
      <!-- 头像上传 -->
      <!-- show-file-list 是否显示文件列表   -->
      <!-- name 上传文件后键名   -->
      <!-- action 上传地址   -->
      <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar" class="form_avatar">
        <el-upload
          name="image"
          class="avatar-uploader"
          :action="avatarURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 178px;"></i>
        </el-upload>
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item label="昵称" :label-width="formLabelWidth" prop="username">
        <el-input v-model="regForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="regForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 手机 -->
      <el-form-item label="手机" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="regForm.phone" autocomplete="off"></el-input>
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
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="rcode">
            <el-input v-model="regForm.rcode" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <!-- 当sec=0时, 按钮不可用,并且会显示一个倒计时 -->
          <el-button
            class="btnFull"
            @click="getRcode"
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
import { sendSMS, register } from "@/api/register.js";
export default {
  name: "reg",
  data() {
    return {
      imageUrl: "",
      avatarURL: process.env.VUE_APP_URL + "/uploads",
      picCodeUrl:
        process.env.VUE_APP_URL + "/captcha?type=sendsms&lol=" + Date.now(),
      regForm: {
        avatar: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        imgCode: "",
        rcode: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "65px",
      isBan: false,
      sec: 0,
      rules: {
        avatar: [
          {
            required: true,
            message: "请上传头像图片",
            trigger: "blur"
          }
        ],
        username: [
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
            trigger: "change"
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
        phone: [
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
        rcode: [
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
      // valid验证的只是表单元素的值
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证全部通过后调用api文件返回的方法进行注册
          register(this.regForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success("恭喜您,注册成功");
              this.dialogFormVisible = false;
              // 清空表单元素
              this.$refs[formName].resetFields();
              // 清空imageUrl
              this.imageUrl = "";
            } else {
              this.$message.warning("注册失败");
            }
          });
        } else {
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
        process.env.VUE_APP_URL + "/captcha?type=login&lol=" + Date.now();
    },
    getRcode() {
      // 验证用户输入的手机号格式是否正确
      if (!/0?(13|14|15|18|17)[0-9]{9}/.exec(this.regForm.phone)) {
        return this.$message.error("手机号码格式不正确, 请重新输入!");
      }
      // 验证用户输入的图形验证码长度是否正确
      if (this.regForm.imgCode.length != 4) {
        return this.$message.error("验证码为四位数!");
      }
      // 点击后将倒计时sec设置为60
      this.sec = 60;
      // 创建一个计时器每隔1s触发一次sec--, 并判断sec是否为0, 为0则清除该计时器
      let timerID = setInterval(() => {
        if (this.sec <= 0) {
          clearInterval(timerID);
        } else {
          this.sec--;
        }
      }, 1000);

      // 获取短信验证码
      // 调用sendSMS()
      sendSMS({
        code: this.regForm.imgCode,
        phone: this.regForm.phone
      }).then(res => {
        //成功回调
        console.log(res);
        if (res.data.code == 200) {
          alert(`手机验证码为 ${res.data.data.captcha}`);
        } else if (res.data.code == 0) {
          this.$message.error(res.data.message);
          this.sec = 0;
        }
      });
    },

    // 头像上传方法
    // 上传图片后显示预览图
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // 手动给avatar赋值后没有进行校验
      this.regForm.avatar = res.data.file_path;
      // 为了去掉报错信息, 需要单独对该表单元素进行校验
      this.$refs.regForm.validateField("avatar");
    },
    // 上传前调用,判断上传的文件, 符合规则才上传, 否则报错
    beforeAvatarUpload(file) {
      // 限制格式
      const isJPG = file.type === "image/jpeg" || "image/png" || "image/gif";
      // 文件大小
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.form_avatar {
  text-align: center;
}
</style>