<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="system-dialog" style="width: 420px; max-width: 95vw">
      <!-- HEADER -->
      <div class="system-dialog-header">
        <div class="system-dialog-title">Movimentar Estoque</div>
      </div>

      <!-- BODY -->
      <div class="system-dialog-body q-gutter-md">
        <q-select
          v-model="form.variantId"
          :options="variants"
          option-label="label"
          option-value="value"
          label="Variante"
          emit-value
          map-options
          use-input
          fill-input
          outlined
          dense
        />

        <q-input v-model.number="form.quantity" type="number" label="Quantidade" outlined dense />

        <q-select
          v-model="form.type"
          :options="[
            { label: 'Entrada', value: 'IN' },
            { label: 'Saída', value: 'OUT' },
          ]"
          label="Tipo"
          emit-value
          map-options
          outlined
          dense
        />

        <q-input
          v-model="form.reason"
          label="Descrição da movimentação"
          type="textarea"
          autogrow
          outlined
          dense
        />
      </div>

      <!-- FOOTER -->
      <div class="system-dialog-footer">
        <q-btn flat label="Cancelar" @click="close" class="dialog-cancel-btn" />

        <q-btn label="Salvar" @click="submit" class="dialog-save-btn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStockStore } from 'src/stores/stock'
import { useProductStore } from 'src/stores/products'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const productStore = useProductStore()
const stockStore = useStockStore()

const form = ref({
  variantId: null,
  quantity: 1,
  type: 'IN',
  reason: '',
})

const variants = computed(() => {
  return productStore.allVariants
    .filter((v) => v.active !== false && v.product?.active !== false)
    .map((v) => ({
      label: `${v.product.name} - ${v.name}`,
      value: v.id,
    }))
})

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  console.log(form.value)
  await stockStore.createMovement(form.value)
  close()
}
</script>
