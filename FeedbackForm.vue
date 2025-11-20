<template>
  <div class="feedback-container">
    <!-- 引入 Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Martel:wght@300;800&display=swap" rel="stylesheet">

    <!-- 头部设计区域 -->
    <header class="header-section">
      <div class="logo">
        <img src="../assets/logo.png" alt="Synapnote Logo" class="logo-icon-img">
        <span class="logo-text">synapnote</span>
      </div>
      
      <div class="main-title">
        <div class="line-1">Meeting Strategist:</div>
        <div class="line-2">
          Your <span class="highlight">AI Pre-Meeting</span> Officer
        </div>
      </div>
      
      <p class="subtitle">
        Get insights 5 minutes before the meeting about what to expect, how to respond, and how to win.
      </p>
    </header>

    <form @submit.prevent="handleSubmit" class="feedback-form">
      <div class="form-group">
        <label for="email">邮箱地址（必填）：</label>
        <input type="email" id="email" v-model="formData.email" required>

        <label for="feedback">您的反馈（可选）：</label>
        <textarea id="feedback" v-model="formData.feedback" rows="4"></textarea>
      </div>

      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onUnmounted } from 'vue'
import { useToast } from "vue-toastification"

// 1. 获取 toast 实例
const toast = useToast()

// 定义一个变量来存定时器 ID,用于清除定时器
let timerId = null

const formData = ref({
  email: '',
  feedback: ''
})

// 在 setup 顶层获取实例
const instance = getCurrentInstance()

const handleSubmit = () => {
  // 准备要在控制台打印的数据
  const logData = {
    email: formData.value.email,
    timestamp: new Date().toLocaleString(),
    device: navigator.userAgent,
    feedback: formData.value.feedback
  }

  // 打印到控制台
  console.log('=== 新的反馈提交 ===')
  console.log('邮箱:', logData.email)
  console.log('提交时间:', logData.timestamp)
  console.log('设备类型:', logData.device)
  console.log('反馈意见:', logData.feedback)
  console.log('==================')
  
  // 获取全局属性
  const $posthog = instance?.proxy?.$posthog
  
  if ($posthog) {
    $posthog.capture("survey sent", {
      $survey_id: '019a9b3b-a020-0000-319e-f6cb7f3415ba',
      $survey_response: formData.value.email,
      $survey_response_1: formData.value.feedback
    })
  } else {
    console.warn('PostHog not initialized')
  }
  
  // 2. 使用 Toast 替换原来的 submitted 逻辑
  toast.success("感谢您的反馈！")
  
  //如果之前有定时器在跑，先清除它
  if (timerId) clearTimeout(timerId)
  
  // 重置表单
  timerId = setTimeout(() => {
    formData.value = { email: '', feedback: '' }
    timerId = null
  }, 3000)
}

// 组件卸载时的生命周期钩子 清除定时器
onUnmounted(() => {
  if (timerId) {
    clearTimeout(timerId)
    timerId = null
  }
})
</script>

<style lang="scss" scoped>
.feedback-container {
  max-width: 1440px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 80px;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
    
    .logo-icon-img {
      width: 43px;
      height: 43px;
      margin-right: 12px;
      background: #000;
      border-radius: 11px;
      padding: 8px;
      box-sizing: border-box;
    }

    .logo-text {
      font-family: sans-serif; // 类似 Microsoft YaHei
      font-weight: 700;
      font-size: 36px;
      color: #000;
      letter-spacing: -0.5px;
    }
  }

  .main-title {
    font-family: 'Martel', serif; // 关键：使用 Martel 字体
    font-weight: 800; // ExtraBold
    color: #000;
    line-height: 1.3;
    margin-bottom: 32px;

    .line-1 {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .line-2 {
      font-size: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      //flex-wrap: nowrap; 不换行
      gap: 20px;

      .highlight {
        background-color: #B4EA7E; // Figma 里的酸橙绿
        padding: 10px 40px 8px 40px; // 视觉调整内边距
        border-radius: 58.5px;
        white-space: nowrap;
        display: inline-block;
        line-height: 1.3;
        transform: rotate(2deg); // 顺时针旋转5度
        transform-origin: center;
        margin-left: 10px; // 因为旋转，增加一点边距防止挤压
        margin-right: 10px;
      }
    }
  }

  .subtitle {
    font-family: 'Martel', serif;
    font-weight: 300; // Light
    color: #000;
    font-size: 20px;
    margin: 0 auto;
    line-height: 1.5;
    white-space: nowrap;
    text-align: center;
  }
}

.feedback-form {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;

  .form-group {
    margin-bottom: 24px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      text-align: left;
      font-size: 14px;
      color: #333;
    }

    input,
    textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.2s;
      background-color: #f9f9f9;

      &:focus {
        outline: none;
        border-color: #B4EA7E;
        background-color: #fff;
        box-shadow: 0 0 0 3px rgba(180, 234, 126, 0.2);
      }
    }
  }

  button {
    padding: 14px 40px;
    background-color: #000;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    transition: transform 0.1s, opacity 0.2s;

    &:hover {
      opacity: 0.75;
    }
    
    &:active {
      transform: scale(0.92);
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .header-section .main-title {
    .line-1, .line-2 {
      font-size: 42px; // 手机端稍微缩小
    }
    .line-2 .highlight {
      padding: 0 20px 4px 20px;
      transform: rotate(1.8deg); // 手机端旋转角度稍微减小一点，防止布局错乱
    }
  }
  
  .header-section .subtitle {
    font-size: 16px;
  }
}
</style>
