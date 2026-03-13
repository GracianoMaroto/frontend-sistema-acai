<template>
  <q-card class="product-variant-card q-mb-sm">
    <q-card-section class="variant-meta">
      <div class="product-variant-body">
        <div class="variant-name">
          {{ variant.name }}
        </div>

        <div class="row q-col-gutter-md">
          <div class="variant-price">R$ {{ price.toFixed(2) }}</div>

          <div class="variant-stock">Estoque: {{ variant.stockQuantity }}</div>

          <div>Custo: R$ {{ cost.toFixed(2) }}</div>

          <div :class="lucro >= 0 ? 'text-positive' : 'text-negative'">Lucro: R$ {{ lucro }}</div>

          <div>Margem: {{ margem }}%</div>
        </div>
      </div>

      <q-btn flat round icon="edit" color="primary" @click="$emit('edit', variant)" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: Object,
})

const price = computed(() => {
  const p = props.variant?.prices?.[0]?.price
  return parseFloat(p) || 0
})

const cost = computed(() => {
  const c = props.variant?.prices?.[0]?.cost
  return parseFloat(c) || 0
})

const lucro = computed(() => {
  return (price.value - cost.value).toFixed(2)
})

const margem = computed(() => {
  if (price.value === 0) return 0
  return (((price.value - cost.value) / price.value) * 100).toFixed(0)
})
</script>
