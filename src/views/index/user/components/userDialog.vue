<template>
  <el-dialog :title="isAdd?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible" width="600px" center>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="电话" :label-width="formLabelWidth">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id" :label-width="formLabelWidth">
        <el-select @change="form.role_id=form.role" v-model="form.role" placeholder="请选择角色">
          <el-option label="超级管理员" value="1"></el-option>
          <el-option label="管理员" value="2"></el-option>
          <el-option label="老师" value="3"></el-option>
          <el-option label="学生" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="禁用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('form')">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, editUser } from "@/api/userDialog.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      isAdd: true,
      form: {
        username: "",
        email: "",
        phone: "",
        status: null,
        role_id: null,
        remark: "",
        role: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "用户名长度在2到16个字之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "请输入正确的邮箱格式",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            pattern: /0?(13|14|15|18|17)[0-9]{9}/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        role_id: [{ required: true, message: "请选择角色", trigger: "blur" }]
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    // 确定按钮点击事件
    submitForm(form) {
      // 进行表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          // 判断是新增还是编辑
          if (this.isAdd) {
            // 为true则为新增
            // 验证成功则调用API的方法
            addUser(this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success("新增用户成功");
                // 更新用户列表
                this.$parent.page = 1;
                this.$parent.getList();
                this.form = {};
              } else {
                // 服务器返回其他状态码则显示服务器返回的错误语句
                this.$message.error(res.data.message);
              }
            });
          } else {
            // 否则为编辑
            // 调用编辑用户的方法
            editUser(this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success("编辑用户信息成功");
                // 更新用户列表
                this.$parent.getList();
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
          this.dialogFormVisible = false;
        } else {
          // 验证失败则
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 取消按钮点击事件
    resetForm(form) {
      this.dialogFormVisible = false;
      this.$refs[form].resetFields();
    }
  }
};
</script>

<style>
</style>