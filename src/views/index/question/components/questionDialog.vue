<template>
  <el-dialog :title="isAdd?'新增题库':'编辑题库'" :visible.sync="dialogFormVisible" center fullscreen>
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="subject" label="学科" :label-width="formLabelWidth">
        <subjectSelect v-model="form.subject"></subjectSelect>
      </el-form-item>

      <el-form-item prop="step" label="阶段" :label-width="formLabelWidth">
        <el-select v-model="form.step" placeholder="请选择阶段">
          <el-option label="初级" :value="1"></el-option>
          <el-option label="中级" :value="2"></el-option>
          <el-option label="高级" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="enterprise" label="企业" :label-width="formLabelWidth">
        <businessSelect v-model="form.enterprise"></businessSelect>
      </el-form-item>

      <el-form-item prop="city" label="城市" :label-width="formLabelWidth">
        <div class="block">
          <el-cascader
            v-model="form.city"
            :options="options"
            :props="{ expandTrigger: 'hover',value:'label'}"
            @change="handleChange"
          ></el-cascader>
        </div>
      </el-form-item>

      <el-form-item prop="type" label="题型" :label-width="formLabelWidth">
        <div class="box">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">多选</el-radio>
            <el-radio :label="3">简答</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item prop="difficulty" label="难度" :label-width="formLabelWidth">
        <div class="box">
          <el-radio-group v-model="form.difficulty">
            <el-radio :label="1">简单</el-radio>
            <el-radio :label="2">一般</el-radio>
            <el-radio :label="3">困难</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label-width="265px">
        <el-divider></el-divider>
      </el-form-item>

      <el-form-item prop="title" label="试题标题" :label-width="formLabelWidth">
        <myEditor v-model="form.title"></myEditor>
      </el-form-item>

      <el-form-item
        prop="single_select_answer"
        label="单选"
        :label-width="formLabelWidth"
        v-if="form.type==1"
      >
        <el-radio-group v-model="form.single_select_answer">
          <questionItem
            v-for="(item, index) in form.select_options"
            :key="index"
            :label.sync="item.label"
            :text.sync="item.text"
            :image="item.image"
            :isRadio="true"
          ></questionItem>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        prop="multiple_select_answer"
        label="多选"
        :label-width="formLabelWidth"
        v-else-if="form.type==2"
      >
        <el-checkbox-group v-model="form.multiple_select_answer">
          <questionItem
            v-for="(item, index) in form.select_options"
            :key="index"
            :label.sync="item.label"
            :text.sync="item.text"
            :image="item.image"
            :isRadio="false"
          ></questionItem>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item prop="short_answer" label="简答" :label-width="formLabelWidth" v-else>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.short_answer"></el-input>
      </el-form-item>

      <el-form-item label-width="265px">
        <el-divider></el-divider>
      </el-form-item>

      <el-form-item prop="video" label="解析视频" :label-width="formLabelWidth">
        <videoUpload :video.sync="form.video"></videoUpload>
      </el-form-item>

      <el-form-item label-width="265px">
        <el-divider></el-divider>
      </el-form-item>

      <el-form-item prop="answer_analyze" label="答案解析" :label-width="formLabelWidth">
        <myEditor v-model="form.answer_analyze"></myEditor>
      </el-form-item>

      <el-form-item label-width="265px">
        <el-divider></el-divider>
      </el-form-item>

      <el-form-item prop="remark" label="试题备注" :label-width="formLabelWidth">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('form')">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import questionItem from "./questionItem.vue";
import { regionDataPlus } from "element-china-area-data";
import myEditor from "./myEditor.vue";
import videoUpload from "./videoUpload.vue";
import { questionAdd, questionEdit } from "@/api/question.js";
export default {
  components: {
    myEditor,
    questionItem,
    videoUpload
  },
  data() {
    return {
      dialogFormVisible: false,
      isAdd: true,
      form: {
        type: 1,
        multiple_select_answer: [],
        select_options: [
          {
            label: "A",
            text: "",
            image: ""
          },
          {
            label: "B",
            text: "",
            image: ""
          },
          {
            label: "C",
            text: "",
            image: ""
          },
          {
            label: "D",
            text: "",
            image: ""
          }
        ],
        video: ""
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "blur" }],

        step: [{ required: true, message: "请选择阶段", trigger: "blur" }],

        enterprise: [
          { required: true, message: "请选择企业", trigger: "blur" }
        ],

        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        type: [{ required: true, message: "请选择题型", trigger: "blur" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        answer_analyze: [
          { required: true, message: "请输入答案解析", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入试题备注", trigger: "blur" }
        ],
        single_select_answer: [
          { required: true, message: "请选择答案", trigger: "blur" }
        ],
        multiple_select_answer: [
          { required: true, message: "请选择答案", trigger: "blur" }
        ],
        short_answer: [
          { required: true, message: "请输入答案", trigger: "blur" }
        ]
      },

      formLabelWidth: "360px",
      // 级联选择器选项d
      options: regionDataPlus
    };
  },
  methods: {
    // 级联选择器change事件
    handleChange(value) {
      console.log(value);
    },

    // 确定按钮点击事件
    submitForm(form) {
      // 进行表单验证
      this.$refs[form].validate(valid => {
        if (valid) {
          // 判断是新增还是编辑
          if (this.isAdd) {
            // 为true则为新增
            // 验证成功则调用API的方法
            questionAdd(this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success("题目新增成功");
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            // 否则为编辑
            // 调用编辑的方法
            questionEdit(this.form).then(res => {
              if (res.data.code == 200) {
                this.$message.success("题目编辑成功");
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
          this.dialogFormVisible = false;
          this.$parent.getList();
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

<style lang="less" scope>
.el-select {
  width: 364px;
}
.block .el-input {
  width: 364px;
  .el-input__inner {
    width: 100%;
  }
}
.box .el-radio-group {
  width: 360px;
}
.el-form-item .el-divider--horizontal {
  width: 940px;
}
.el-textarea .el-textarea__inner {
  width: 835px;
}
</style>