<template>
  <q-dialog v-model="open">
    <q-card class="confirm-dialog">
      <q-card-section>
        <div class="confirm-title">
          {{ title }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="confirm-message">
          {{ message }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" class="dialog-cancel-btn" @click="cancel" v-close-popup />

        <q-btn label="Confirmar" class="dialog-save-btn" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)
const title = ref('')
const message = ref('')
let resolver = null

function show(t, m) {
  title.value = t
  message.value = m
  open.value = true

  return new Promise((resolve) => {
    resolver = resolve
  })
}

function confirm() {
  open.value = false
  resolver?.(true)
  resolver = null
}

function cancel() {
  open.value = false
  resolver?.(false)
  resolver = null
}

defineExpose({ show })
</script>

<style scoped>
.confirm-dialog {
  border-radius: 18px;
  padding: 10px;
  width: 420px;
}

.confirm-title {
  font-family: var(--font-title);
  color: var(--roxo-principal);
  font-size: 1.3rem;
}

.confirm-message {
  font-family: var(--font-body);
}
</style>
