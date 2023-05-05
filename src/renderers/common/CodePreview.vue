<template>
  <pre class="scratch__code-preview" v-text="code"></pre>
</template>

<script>
export default {
  name: 'ScratchCodePreview',

  props: {
    code: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.scratch__code-preview {
  flex: 0 0 200px;
  padding: 10px;
  background-color: white;
  border-left: 1px solid #e7e8ea;
  font-size: 12px;
  margin: 0;
  white-space: break-spaces;
  z-index: 3;
}
</style>
