<template>
  <el-select v-model="mySubject" placeholder="请选择学科" @change="$emit('input', mySubject)">
    <el-option label="全部学科" v-if="isSearch" value></el-option>
    <el-option v-for="(item,index) in subjectList" :key="index" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getSubject } from "@/api/subject.js";
export default {
  props: {
    value: {},
    isSearch: Boolean
  },

  data() {
    return {
      mySubject: this.value,
      subjectList: []
    };
  },
  created() {
    //   获取学科数据
    getSubject({
      status: 1
    }).then(res => {
      this.subjectList = res.data.data.items;
    });
  },
  watch: {
    value: function() {
      this.mySubject   = this.value;
    }
  }
};
</script>

<style>
</style>