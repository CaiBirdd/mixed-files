<template>
  <form @submit.prevent="handleSubmit" class="feedback-form">
    <div class="form-group">
      <label for="email">邮箱地址（必填）：</label>
      <input 
        type="email" 
        id="email" 
        v-model="formData.email" 
        required
      >
    
      <label for="feedback">您的反馈（可选）：</label>
      <textarea 
        id="feedback" 
        v-model="formData.feedback" 
        rows="4"
      ></textarea>
    </div>
    
    <button type="submit">提交</button>
    
    <p v-if="submitted" class="success-message">感谢您的反馈！</p>
  </form>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const formData = ref({
  email: '',
  feedback: ''
});

const submitted = ref(false);

// 在 setup 顶层获取实例
const instance = getCurrentInstance();

const handleSubmit = () => {
  // 1. 准备要在控制台打印的数据
  const logData = {
    email: formData.value.email,
    timestamp: new Date().toLocaleString(),//自己看的时间
    device: navigator.userAgent,//自己看的设备类型
    feedback: formData.value.feedback
  };

  // 2. 打印到控制台
  console.log('=== 新的反馈提交 ===');
  console.log('邮箱:', logData.email);
  console.log('提交时间:', logData.timestamp);
  console.log('设备类型:', logData.device);
  console.log('反馈意见:', logData.feedback);
  console.log('==================');
  // 获取全局属性
  const $posthog = instance?.proxy?.$posthog;
  
  // 提交调查响应到 PostHog
  // 注意：如果 posthog 未初始化成功，$posthog 可能为 undefined，建议加个检查
  // $posthog.capture(eventName, properties): 这是 PostHog SDK 中用于发送自定义事件的核心方法。发送post请求
  if ($posthog) {
    $posthog.capture("survey sent", {
      $survey_id: '019a9b3b-a020-0000-319e-f6cb7f3415ba',
      $survey_response: formData.value.email, // 第一个空是邮箱
      $survey_response_1: formData.value.feedback // 第二空是反馈
    });
  } else {
    console.warn('PostHog not initialized');
  }
  
  // 显示成功消息
  submitted.value = true;
  
  // 重置表单
  setTimeout(() => {
    formData.value = { email: '', feedback: '' };
    submitted.value = false;
  }, 3000);
};
</script>

<style scoped>
.feedback-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
