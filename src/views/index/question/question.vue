<template>
  <!-- 根标签 -->
  <div class="question-wrap">
    <!-- 顶部卡片 -->
    <el-card>
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
        <el-form-item label="学科">
          <subjectSelect v-model="formInline.subject"></subjectSelect>
        </el-form-item>

        <el-form-item label="阶段">
          <el-select v-model="formInline.step" placeholder="请选择阶段">
            <el-option label="初级" value="1"></el-option>
            <el-option label="中级" value="2"></el-option>
            <el-option label="高级" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业">
          <businessSelect v-model="formInline.enterprise"></businessSelect>
        </el-form-item>

        <el-form-item label="题型">
          <el-select v-model="formInline.type" placeholder="请选择题型">
            <el-option label="单选" value="1"></el-option>
            <el-option label="多选" value="2"></el-option>
            <el-option label="简答" value="3"></el-option>
          </el-select>
        </el-form-item>

        <br />

        <el-form-item label="难度">
          <el-select v-model="formInline.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="1"></el-option>
            <el-option label="一般" value="2"></el-option>
            <el-option label="困难" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作者">
          <el-input v-model="formInline.username"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <div class="block">
            <el-date-picker v-model="formInline.create_date" type="date" placeholder="选择日期"></el-date-picker>
          </div>
        </el-form-item>

        <br />

        <el-form-item label="标题" class="title-item">
          <el-input v-model="formInline.title"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearSearch">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="questionAdd">新增试题</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下面卡片 -->
    <el-card class="box-card">
      <!-- 表格部分 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科-阶段">
          <template slot-scope="scope">
            <span>{{scope.row | subject_step}}</span>
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">单选</span>
            <span v-if="scope.row.type==2">多选</span>
            <span v-if="scope.row.type==3">简答</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterprise" label="企业"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span class="red" v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="reads" label="访问量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="['超级管理员','管理员','老师'].includes($store.state.role)"
            >编辑</el-link>
            <el-link
              type="primary"
              @click="handleBan(scope.$index, scope.row)"
              v-if="['超级管理员','管理员','老师'].includes($store.state.role)"
            >{{scope.row.status==1?"禁用":"启用"}}</el-link>
            <el-link
              type="primary"
              @click="handleDelete(scope.$index, scope.row)"
              v-if="['超级管理员','管理员'].includes($store.state.role)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 对话框 -->
    <questionDialog ref="questionDialog"></questionDialog>
  </div>
</template>

<script>
import { questionList } from "@/api/question.js";
import questionDialog from "./components/questionDialog.vue";
export default {
  name: "question",
  components: {
    questionDialog
  },
  data() {
    return {
      formInline: {},
      tableData: [],
      total: 100,
      page: 1,
      size: 5,
      preRow: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: ""
    };
  },
  methods: {
    // 获取题目列表
    getList(data) {
      questionList({ page: this.page, limit: this.size, ...data }).then(res => {
        console.log(res);
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      });
    },

    // 唤出对话框
    questionAdd() {
      this.$refs.questionDialog.isAdd = true;
      this.$refs.questionDialog.dialogFormVisible = true;
    },

    // 编辑按钮点击事件
    handleEdit(index, row) {
      // 将此行数据传给编辑对话框
      // 由于对象是引用类型, 为了避免修改对话框中信息时导致表格中信息同时变化,所以此处直接用...解构符对该对象进行浅拷贝
      // 只有在同一行第一次点击的时候进行赋值, 第二次点击时不赋值, 以实现编辑状态保存
      // 思路: 每一次点击判断和上一次点击的是不是同一行, 如果是则不赋值, 不是则重新赋值

      // 将isAdd设置为false
      this.$refs.questionDialog.isAdd = false;
      // 判断此次点击的行是不是上一次点击的行
      if (row != this.preRow) {
        // 不是,则将此次点击的行存到preRow中
        this.preRow = row;
        // 然后将数据对象拷贝一分给对话框
        this.$refs.questionDialog.form = { ...row };
        this.$refs.questionDialog.form.city = row.city.split(",");
      } else {
        // 如果是则什么都不做
      }
      // 显示编辑对话框
      this.$refs.questionDialog.dialogFormVisible = true;
    },

    handleSizeChange(val) {
      // 页容量改变时默认页码切换至第一页
      this.page = 1;
      this.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },

    // 搜索题目
    search() {
      this.getList(this.formInline);
    },
    // 清除按钮点击事件
    clearSearch() {
      // 将表单重置为初始值并移除校验结果
      this.$refs.formInline.resetFields();
      // 重新获取企业列表
      this.getList();
    }
  },
  // 局部过滤器
  filters: {
    subject_step(val) {
      let stepName = "";
      if (val.step == 1) {
        stepName = "初级";
      } else if (val.step == 2) {
        stepName = "中级";
      } else if (val.step == 3) {
        stepName = "高级";
      }
      return val.subject_name + "-" + stepName;
    }
  },
  created() {
    // 获取所有题目列表
    this.getList();
  }
};
</script>

<style lang="less" scope>
.question-wrap {
  /* 找到除了最后一个el-form-item下面的所有 el-form-item__content
    el-form-item代表的是每一项（代表除了最后一项以外的其他项里所有内容为宽150）
 */
  .el-form-item:not(:last-child) .el-form-item__content {
    width: 150px;
  }

  /* 找到标题那一栏里面的内容，设置他的内容为宽度388 */
  .el-form-item.title-item .el-form-item__content {
    width: 388px;
  }

  /* 设置每个表单元素前面文字的左右内间距 */
  .el-form-item__label {
    padding-right: 31px;
    padding-left: 30px;
  }

  /* 设置卡片的内间距 */
  .el-card__body {
    padding-left: 0;
  }
}
.el-form--inline .block .el-input__inner {
  width: 150px;
}
.el-form--inline .el-select {
  width: 150px;
}
.el-card {
  margin-bottom: 19px;
}
</style>