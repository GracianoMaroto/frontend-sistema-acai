<template>
  <q-page class="orders-page">
    <div class="row items-center justify-between q-mb-lg">
      <div class="section-title">Produtos</div>

      <q-btn label="Produto" icon="add" class="primary-btn" @click="openCreate" />
    </div>

    <div class="product-list">
      <product-card
        v-for="product in productStore.products"
        :key="product.id"
        :product="product"
        @edit="openEdit"
      />
    </div>

    <ProductDialog v-model="dialog" :product="selected" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'

import ProductDialog from 'src/components/products/ProductDialog.vue'
import ProductCard from 'src/components/products/ProductCard.vue'

const productStore = useProductStore()

const dialog = ref(false)
const selected = ref(null)

function openCreate() {
  selected.value = null
  dialog.value = true
}

function openEdit(product) {
  selected.value = product
  dialog.value = true
}

onMounted(() => {
  productStore.fetchProducts()
  console.log('products', productStore.products)
})
</script>
