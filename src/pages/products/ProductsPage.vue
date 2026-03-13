<template>
  <q-page class="orders-page">
    <div class="row items-center justify-between q-mb-lg">
      <div class="section-title">Produtos</div>

      <q-btn label="Produto" icon="add" class="primary-btn" @click="openCreate" />
    </div>

    <div class="product-list">
      <ProductCard
        v-for="product in productStore.activeProducts"
        :key="product.id"
        :product="product"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <ProductDialog v-model="dialog" :product="selected" />

    <ConfirmDialog ref="confirmDialogRef" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'

import ProductDialog from 'src/components/products/ProductDialog.vue'
import ProductCard from 'src/components/products/ProductCard.vue'
import ConfirmDialog from 'src/components/SystemConfirm.vue'

const productStore = useProductStore()

const dialog = ref(false)
const selected = ref(null)
const confirmDialogRef = ref(null)

function openCreate() {
  selected.value = null
  dialog.value = true
}

function openEdit(product) {
  selected.value = product
  dialog.value = true
}

async function handleDelete(product) {
  const confirmed = await confirmDialogRef.value.show(
    'Excluir produto',
    `Deseja realmente excluir ${product.name}?`,
  )

  if (!confirmed) return

  await productStore.deleteProduct(product.id)
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>
