<template>
  <el-dialog title="新增学科" :visible.sync="dialogFormVisible" width="600px" center>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="rid" label="学科编号" :label-width="formLabelWidth">
        <el-input v-model="form.rid" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="学科名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科简称" :label-width="formLabelWidth">
        <el-input v-model="form.short_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科简介" :label-width="formLabelWidth">
        <el-input v-model="form.intro" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科备注" :label-width="formLabelWidth">
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
import { editSubject } from "@/api/editSubject.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: "",
        status: 1
      },
      rules: {
        rid: [{ required: true, message: "请输入学科编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入学科名称", trigger: "blur" }]
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
          // 验证成功则调用API的方法
          editSubject(this.form).then(res => {
            if (res.data.code == 200) {
              this.$message.success("编辑学科信息成功");
              // 更新学科列表
              this.$parent.getSubjectList();
            } else {
              this.$message.error(res.data.message);
            }
          });
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