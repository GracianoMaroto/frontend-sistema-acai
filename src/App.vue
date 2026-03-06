<template>
  <router-view />

  <SystemNotifications ref="notifyRef" />
  <SystemConfirm ref="confirmRef" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import SystemNotifications from 'src/components/SystemNotifications.vue'
import SystemConfirm from 'src/components/SystemConfirm.vue'

import { setNotify } from 'src/utils/notify'
import { setConfirm } from 'src/utils/confirm'

const notifyRef = ref(null)
const confirmRef = ref(null)

onMounted(async () => {
  await nextTick()
  setNotify(notifyRef.value)
  setConfirm(confirmRef.value)
})
</script>
