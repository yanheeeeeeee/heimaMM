<template>
  <div id="editor">
    <div class="toolbar" ref="toolbar"></div>
    <div class="content" ref="content"></div>
  </div>
</template>

<script>
// 导包
import WangEditor from "wangeditor";
export default {
  props: {
    value: {}
  },
  mounted() {
    var editor = new WangEditor(this.$refs.toolbar, this.$refs.content);
  
    editor.customConfig.onchange = html => {
      this.$emit("input", html);
    };
    editor.create();
    
    editor.txt.html(this.value)
  }
};
</script>

<style>
#editor {
  width: 835px;
}
#editor > div {
  width: 100%;
  border: 1px solid #d3d7df;
}
.content {
  height: 50px;
}
</style>