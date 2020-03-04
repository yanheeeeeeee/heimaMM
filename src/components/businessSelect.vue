<template>
  <el-select v-model="myBusiness" placeholder="请选择企业" @change="$emit('input',myBusiness)">
    <el-option
      v-for="(item,index) in businessList"
      :key="index"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
import { getBusiness } from "@/api/business.js";
export default {
  props: {
    value: {}
  },
  data() {
    return {
      myBusiness: this.value,
      businessList: []
    };
  },
  created() {
    // 获取企业数据
    getBusiness({
      status: 1
    }).then(res => {
      this.businessList = res.data.data.items;
    });
  }
};
</script>

<style>
</style>