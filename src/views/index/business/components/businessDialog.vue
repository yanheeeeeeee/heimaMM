<template>
  <el-dialog :title="isAdd?'新增企业':'编辑企业'" :visible.sync="dialogFormVisible" width="600px" center>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="eid" label="企业编号" :label-width="formLabelWidth">
        <el-input v-model="form.eid" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="企业名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="short_name" label="企业简称" :label-width="formLabelWidth">
        <el-input v-model="form.short_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="intro" label="企业简介" :label-width="formLabelWidth">
        <el-input v-model="form.intro" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" :label-width="formLabelWidth">
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
import { addBusiness } from "@/api/addBusiness.js";
import { editBusiness } from "@/api/editBusiness.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      isAdd: true,
      form: {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: "",
        status: 1
      },
      rules: {
        eid: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入企业名称", trigger: "blur" }]
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
            addBusiness(this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success("新增企业成功");
                // 更新企业列表
                this.$parent.getBusinessList();
                this.form = {};
              } else {
                // 服务器返回其他状态码则显示服务器返回的错误语句
                this.$message.error(res.data.message);
              }
            });
          } else {
            // 否则为编辑
            // 调用编辑企业的方法
            editBusiness(this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success("编辑企业信息成功");
                // 更新企业列表
                this.$parent.getBusinessList();
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