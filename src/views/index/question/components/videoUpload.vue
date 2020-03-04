<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    <video :src="videoUrl" v-if="videoUrl" controls></video>
  </div>
</template>

<script>
export default {
  props: {
    video: String
  },
  data() {
    return {
      // 上传视频路径
      uploadUrl: process.env.VUE_APP_URL + "/question/upload",
      // 视频预览路径
      videoUrl: this.video
    };
  },
  methods: {
    // 上传视频钩子函数
    handleAvatarSuccess(res, file) {
      this.videoUrl = URL.createObjectURL(file.raw);
      this.$emit("update:video", this.videoUrl);
    },
    beforeAvatarUpload(file) {
      const isMP4 = file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isMP4) {
        this.$message.error("上传视频只能是 MP4 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传视频大小不能超过 2MB!");
      }
      return isMP4 && isLt2M;
    }
  }
};
</script>

<style scope>
.avatar-uploader .el-upload {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>