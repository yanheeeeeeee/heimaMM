<template>
  <!-- 注册模块Form -->
  <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
    <el-form :model="regForm">
      <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="regForm.nickname" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      regForm: {
        nickname: "",
        email: "",
        pboneNum: "",
        password: "",
        imgCode: "",
        msgCode: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "60px"
    };
  }
};
</script>

<style>
</style>