<template>
  <q-page class="orders-page">
    <div class="row items-center justify-between q-mb-sm">
      <div class="section-title">Estoque</div>

      <q-btn label="Movimentar" icon="add" class="primary-btn" @click="dialog = true" />
    </div>

    <VariantStockCard
      v-for="variant in productStore.allVariants"
      :key="variant.id"
      :variant="variant"
    />

    <div class="q-mt-lg">
      <div class="section-title q-mb-sm">Movimentações</div>

      <StockMovementCard
        v-for="movement in stockStore.movements"
        :key="movement.id"
        :movement="movement"
      />
    </div>

    <StockMovementDialog v-model="dialog" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStockStore } from 'src/stores/stock'
import { useProductStore } from 'src/stores/products'

import StockMovementDialog from 'src/components/stock/StockMovementDialog.vue'
import VariantStockCard from 'src/components/stock/VariantStockCard.vue'
import StockMovementCard from 'src/components/stock/StockMovementCard.vue'

const productStore = useProductStore()
const stockStore = useStockStore()

const dialog = ref(false)

onMounted(async () => {
  await productStore.fetchProducts()
  await stockStore.fetchMovements()
})
</script>
