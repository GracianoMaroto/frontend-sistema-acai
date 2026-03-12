<template>
  <q-card class="q-mb-md">
    <q-card-section class="row items-center justify-between">
      <div>
        <div class="text-subtitle1">{{ variant.product.name }} - {{ variant.name }}</div>

        <div class="text-caption text-grey">Estoque atual: {{ variant.stockQuantity }}</div>
      </div>

      <q-btn flat dense icon="swap_vert" @click="$emit('move', variant)" />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  variant: Object,
})

defineEmits(['move'])
</script>
