<template>
  <div>
    <!-- 顶部卡片 -->
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="用户名称" prop="username">
          <el-input class="normal" v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input class="normal" v-model="formInline.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select class="normal" v-model="formInline.role_id" placeholder="请选择状态">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearSearch">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下面卡片 -->
    <el-card class="box-card">
      <!-- 表格部分 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.role_id==1">超级管理员</span>
            <span v-if="scope.row.role_id==2">管理员</span>
            <span v-if="scope.row.role_id==3">老师</span>
            <span v-if="scope.row.role_id==4">学生</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span class="red" v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
            <el-link
              type="primary"
              @click="handleBan(scope.$index, scope.row)"
            >{{scope.row.status==1?"禁用":"启用"}}</el-link>
            <el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
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
    <userDialog ref="userDialog"></userDialog>
  </div>
</template>

<script>
import { getUser, setStatus, delUser } from "@/api/user.js";
// 导入对话框
import userDialog from "./components/userDialog.vue";
export default {
  components: {
    userDialog
  },
  data() {
    return {
      formInline: {
        email: "",
        username: "",
        role_id: ""
      },
      preRow: "",
      tableData: [],
      total: 100,
      page: 1,
      size: 5
    };
  },
  methods: {
    // 获取用户信息并渲染到页面
    getList(params) {
      getUser({ page: this.page, limit: this.size, ...params }).then(res => {
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      });
    },

    // 分页控件点击页码事件
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },

    // 分页控件切换页容量事件
    handleSizeChange(val) {
      this.size = val;
      this.page = 1;
      this.getList();
    },

    // 禁用/启用按钮点击事件
    handleBan(index, row) {
      // 调用接口向服务器发送请求
      setStatus(row.id).then(res => {
        // 如果返回的状态码为200,则弹出成功提示并刷新表格
        if (res.data.code == 200) {
          this.$message.success("修改用户状态成功");
          this.getList();
        } else {
          // 否则发送错误提示
          this.$message.error(res.data.message);
        }
      });
    },

    // 删除按钮点击事件
    handleDelete(index, row) {
      // 调用接口向服务器发送请求
      delUser(row.id).then(res => {
        // 如果返回的状态码为200,则弹出成功提示并刷新表格
        if (res.data.code == 200) {
          this.$message.success("删除用户成功");
          // 如果当前表格只有一行数据,并且当前页码不为1,则发送请求时请求上一页的数据
          if (this.tableData.length == 1 && this.page != 1) {
            this.page -= 1;
          }
          this.getList();
        } else {
          // 否则发送错误提示
          this.$message.error(res.data.message);
        }
      });
    },

    // 搜索按钮点击事件
    search() {
      // 调用获取用户列表方法时要传入具体的筛选信息, 并且跳转到第一页
      this.page = 1;
      this.getList(this.formInline);
    },

    // 清除按钮点击事件
    clearSearch() {
      // 重置表单数据
      this.$refs.formInline.resetFields();
      // 获取所有用户列表并跳转至第一页
      this.page = 1;
      this.getList();
    },

    // 新增用户按钮点击事件
    handleAdd() {
      // 设置状态为新增
      this.$refs.userDialog.isAdd = true;
      // 清空对话框
      this.$refs.userDialog.form = {};
      // 重置编辑状态保持
      this.preRow = "";
      // 显示对话框
      this.$refs.userDialog.dialogFormVisible = true;
    },
    // 编辑用户按钮点击事件
    handleEdit(index, row) {
      // 设置对话框状态为编辑
      this.$refs.userDialog.isAdd = false;
      // 编辑状态保存
      if (this.preRow != row) {
        // 当前点击行与上一此点击行不相等时, 将当前行的数据拷贝给对话框
        this.$refs.userDialog.form = { ...row };
        // 并将当前行存储在prerow中
        this.preRow == row;
      }
      // 显示对话框
      this.$refs.userDialog.dialogFormVisible = true;
    }
  },
  created() {
    // 打开页面后默认获取表格数据
    this.getList();
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
.demo-form-inline {
  text-align: left;
}
</style>