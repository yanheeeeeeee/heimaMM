<template>
  <div>
    <!-- 顶部卡片 -->
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="学科编号" prop="rid">
          <el-input class="normal" v-model="formInline.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input class="normal" v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input class="normal" v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="normal" v-model="formInline.status" placeholder="学科状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearSearch">清除</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="$refs.addSubject.dialogFormVisible=true"
          >新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下面卡片 -->
    <el-card class="box-card">
      <!-- 表格部分 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="rid" label="学科编号"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期">
          <template slot-scope="scope">{{ scope.row.create_time|formatTime }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span class="red" v-else>禁用</span>
          </template>
        </el-table-column>
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
    <!-- 新增学科对话框 -->
    <addSubject ref="addSubject"></addSubject>
    <!-- 编辑学科对话框 -->
    <editSubject ref="editSubject"></editSubject>
  </div>
</template>

<script>
// 导入新增对话框
import addSubject from "./components/addSubject.vue";
import editSubject from "./components/editSubject.vue";
import { getSubject, setStatus, delSubject } from "@/api/subject.js";
export default {
  components: {
    addSubject,
    editSubject
  },
  data() {
    return {
      formInline: {
        rid: "",
        name: "",
        username: "",
        status: ""
      },
      preRow: "",
      tableData: [
        {
          create_time: "2019-11-08 00:53:30",
          username: "刘洋洋",
          name: "前端与移动开发",
          rid: "QD001",
          short_name: "前端",
          status: 1
        }
      ],
      total: 100,
      page: 1,
      size: 5
    };
  },
  methods: {
    // 编辑按钮点击事件
    handleEdit(index, row) {
      console.log(index, row);
      // 将此行数据传给编辑对话框
      // 由于对象是引用类型, 为了避免修改对话框中信息时导致表格中信息同时变化,所以此处直接用...解构符对该对象进行浅拷贝
      // 只有在同一行第一次点击的时候进行赋值, 第二次点击时不赋值, 以实现编辑状态保存
      // 思路: 每一次点击判断和上一次点击的是不是同一行, 如果是则不赋值, 不是则重新赋值

      // 判断此次点击的行是不是上一次点击的行
      if (row != this.preRow) {
        // 不是,则将此次点击的行存到preRow中
        this.preRow = row;
        // 然后将数据对象拷贝一分给对话框
        this.$refs.editSubject.form = { ...row };
      } else {
        // 如果是则什么都不做
      }
      // 显示编辑对话框
      this.$refs.editSubject.dialogFormVisible = true;
    },

    // 修改subject状态
    handleBan(index, row) {
      console.log(index, row);
      setStatus(row.id).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          // 发送消息提示
          this.$message.success("状态修改成功");
          // 刷新表格 (重新请求表格的数据)
          this.getSubjectList();
        } else {
          this.$message.warning("状态修改失败");
        }
      });
    },
    // 封装获取学科列表的函数
    getSubjectList(params) {
      getSubject({ page: this.page, limit: this.size, ...params }).then(res => {
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;

        console.log(res);
      });
    },
    // 删除按钮点击事件
    handleDelete(index, row) {
      delSubject(row.id).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          // 判断当前页的行数, 当前页行数为1时则判断当前页页码是否为1,不为1时则将page减1
          if (this.tableData.length == 1 && this.page != 1) {
            this.page -= 1;
          }
          // 发送消息提示
          this.$message.success("删除成功");
          // 刷新表格 (重新请求表格的数据)
          this.getSubjectList();
        } else {
          this.$message.warning("删除失败");
        }
      });
    },
    handleSizeChange(val) {
      // 页容量改变时默认页码切换至第一页
      this.page = 1;
      this.size = val;
      this.getSubjectList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSubjectList();
    },

    // 搜索按钮点击事件
    search() {
      this.page = 1;
      this.getSubjectList(this.formInline);
    },
    // 清除按钮点击事件
    clearSearch() {
      // 将表单重置为初始值并移除校验结果
      this.$refs.formInline.resetFields();
      // 重新获取学科列表
      this.getSubjectList();
    }
  },
  created() {
    this.getSubjectList();
  }
};
</script>

<style lang="less">
.box-card {
  margin-bottom: 19px;

  .el-form-item {
    line-height: auto;
  }

  .short {
    width: 120px;
  }

  .normal {
    width: 149px;
  }
}
.red {
  color: #ff3d3d;
}
.el-link {
  margin-right: 8px;
}
</style>