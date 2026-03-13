<template>
  <q-card class="q-mb-md">
    <q-card-section class="row items-center justify-between">
      <div>
        <div class="text-subtitle1">{{ variant.product.name }} - {{ variant.name }}</div>

        <div class="text-caption text-grey">Estoque atual: {{ variant.stockQuantity }}</div>
      </div>

      <q-btn flat dense icon="swap_vert" @click="openHistory(variant)" />
    </q-card-section>
  </q-card>

  <q-dialog v-model="historyDialog">
    <q-card style="width: 500px; max-width: 95vw">
      <q-card-section class="text-h6"> Histórico de Movimentação </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list v-if="movements.length">
          <q-item v-for="m in movements" :key="m.id">
            <q-item-section>
              <q-item-label>
                {{ m.type === 'IN' ? 'Entrada' : 'Saída' }}
                - {{ m.quantity }}
              </q-item-label>

              <q-item-label caption>
                {{ m.reason }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              {{ formatDate(m.createdAt) }}
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="text-grey text-center">Nenhuma movimentação encontrada</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useStockStore } from 'src/stores/stock'
import { ref } from 'vue'

defineProps({
  variant: Object,
})

const stockStore = useStockStore()
const historyDialog = ref(false)
const selectedVariant = ref(null)

const movements = ref([])

async function openHistory(variant) {
  selectedVariant.value = variant

  movements.value = await stockStore.getMovementsByVariant(variant.id)

  historyDialog.value = true
}
function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR')
}
</script>
