<template>
  <q-card class="movement-card">
    <q-card-section class="row items-center justify-between">
      <div>
        <div class="text-subtitle1">
          {{ movement.productVariant.product.name }} - {{ movement.productVariant.name }}
        </div>

        <div class="text-caption text-grey-7">
          {{ movement.reason }}
        </div>

        <div class="text-caption text-grey">
          {{ formattedDate }}
        </div>
      </div>

      <q-badge :color="badgeColor">
        {{ movement.type === 'IN' ? '+' : '-' }}{{ movement.quantity }}
      </q-badge>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movement: Object,
})

const badgeColor = computed(() => {
  return props.movement.type === 'IN' ? 'positive' : 'negative'
})

const formattedDate = computed(() => {
  return new Date(props.movement.createdAt).toLocaleString()
})
</script>

<style scoped>
.movement-card {
  margin-bottom: 12px;
  border-radius: 12px;
}
</style>
