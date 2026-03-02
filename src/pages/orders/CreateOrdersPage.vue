<template>
  <q-page class="row">
    <!-- COLUNA PRODUTOS -->
    <div class="col-8 q-pa-md">
      <!-- CANAL -->
      <q-select
        v-model="order.saleChannelId"
        :options="saleChannelOptions"
        label="Canal de Venda"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        outlined
        class="q-mb-md"
      />

      <!-- PRODUTOS GRID -->
      <div class="row q-col-gutter-md">
        <div v-for="variant in productVariants" :key="variant.id" class="col-4">
          <q-card clickable class="cursor-pointer text-center" @click="addItem(variant)">
            <q-card-section>
              <div class="text-h6">
                {{ variant.name }}
              </div>
              <div class="text-subtitle2 text-grey">Estoque: {{ variant.stockQuantity }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- COLUNA CARRINHO -->
    <div class="col-4 bg-grey-2 q-pa-md">
      <div class="text-h6 q-mb-md">Carrinho</div>

      <div v-if="order.items.length === 0">Nenhum item adicionado</div>

      <div v-for="item in order.items" :key="item.productVariantId" class="q-mb-sm">
        <div class="row items-center justify-between">
          <div>
            {{ getVariantName(item.productVariantId) }}
          </div>

          <div class="row items-center">
            <q-btn dense flat icon="remove" @click="decrease(item)" />
            <span class="q-mx-sm">{{ item.quantity }}</span>
            <q-btn dense flat icon="add" @click="increase(item)" />
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <q-btn
        color="primary"
        label="Finalizar Pedido"
        class="full-width"
        :disable="!canFinalize"
        @click="submitOrder"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from 'stores/orders'
import { useProductStore } from 'stores/products'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const orderStore = useOrdersStore()
const productStore = useProductStore()

const order = ref({
  saleChannelId: null,
  customerId: null,
  items: [],
})

const productVariants = ref([])

const saleChannelOptions = computed(() => productStore.saleChannels)

const canFinalize = computed(() => order.value.saleChannelId && order.value.items.length > 0)

const addItem = (variant) => {
  const existing = order.value.items.find((i) => i.productVariantId === variant.id)

  if (existing) {
    existing.quantity++
  } else {
    order.value.items.push({
      productVariantId: variant.id,
      quantity: 1,
    })
  }
}

const increase = (item) => {
  item.quantity++
}

const decrease = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    order.value.items = order.value.items.filter(
      (i) => i.productVariantId !== item.productVariantId,
    )
  }
}

const getVariantName = (id) => {
  const variant = productVariants.value.find((v) => v.id === id)
  return variant?.name || ''
}

const submitOrder = async () => {
  try {
    await orderStore.createOrder(order.value)

    $q.notify({
      type: 'positive',
      message: 'Pedido criado com sucesso!',
    })

    router.push('/orders')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao criar pedido',
    })
  }
}

onMounted(async () => {
  await productStore.fetchProducts()
  await productStore.fetchSaleChannels()

  // extrair variantes
  productVariants.value = productStore.products.flatMap((p) => p.variants)
})
</script>
