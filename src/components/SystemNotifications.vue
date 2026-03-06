<template>
  <div v-if="visible" class="system-notify" :class="type">
    <div class="notify-icon">
      {{ icon }}
    </div>

    <div class="notify-message">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')
const icon = ref('✔')

function show(msg, notifyType = 'success') {
  message.value = msg
  type.value = notifyType

  icon.value =
    notifyType === 'success'
      ? '✔'
      : notifyType === 'error'
        ? '✖'
        : notifyType === 'warning'
          ? '⚠'
          : 'ℹ'

  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, 3000)
}

defineExpose({ show })

onMounted(() => {})

onUnmounted(() => {})
</script>

<style>
.system-notify {
  position: fixed;
  top: 70px;

  left: 0;
  right: 0;
  margin: 0 auto;

  width: fit-content;
  max-width: min(420px, 92vw);

  pointer-events: none;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px 18px;

  border-radius: 14px;
  font-family: var(--font-body);
  font-weight: 600;

  color: white;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);

  z-index: 9999;
}
.system-notify.success {
  background: linear-gradient(135deg, var(--roxo-principal), var(--roxo-escuro));
}

.system-notify.error {
  background: #c0392b;
}

.system-notify.warning {
  background: #e67e22;
}

.system-notify.info {
  background: #3498db;
}

.notify-icon {
  font-size: 18px;
}

.notify-enter-active,
.notify-leave-active {
  transition: all 0.25s ease;
}

.notify-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notify-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
