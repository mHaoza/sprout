<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('tab1')
</script>

<template>
  <div>
    <!-- 示例Tabs及v-model:value用法 -->
    <Tabs v-model:value="activeName" class="my-6">
      <TabPane label="Tab一" tab="tab1">
        <div>这里是标签一的内容</div>
      </TabPane>
      <TabPane label="Tab二" tab="tab2">
        <div>这里是标签二的内容</div>
      </TabPane>
      <TabPane label="禁用Tab" tab="tab3" disabled>
        <div>本Tab被禁用，无法切换</div>
      </TabPane>
    </Tabs>
    <div class="mt-4 text-sm text-gray-500">
      当前激活Tab：{{ activeName }}
    </div>
  </div>
</template>

<style scoped>
.my-6 {
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>
