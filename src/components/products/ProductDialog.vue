<template>
  <q-dialog v-model="model">
    <q-card class="system-dialog">
      <div class="system-dialog-header">
        <div class="system-dialog-title">
          {{ product ? 'Editar Produto' : 'Novo Produto' }}
        </div>
      </div>

      <div class="system-dialog-body q-gutter-md">
        <q-input outlined v-model="form.name" label="Nome" />

        <q-input outlined v-model="form.description" label="Descrição" />

        <div class="section-subtitle">Variantes</div>

        <div
          v-for="(variant, index) in form.variants"
          :key="index"
          class="row q-col-gutter-md q-mb-md"
        >
          <q-input class="col-12 col-md-4" outlined v-model="variant.name" label="Nome" />

          <q-input
            class="col-6 col-md-2"
            v-model.number="variant.price"
            label="Preço"
            prefix="R$"
            type="number"
          />

          <q-input
            class="col-6 col-md-2"
            v-model.number="variant.costPrice"
            label="Custo"
            prefix="R$"
            type="number"
          />

          <q-input
            class="col-8 col-md-2"
            outlined
            v-model.number="variant.stockQuantity"
            label="Estoque"
            type="number"
          />

          <div class="col-4 col-md-2 flex flex-center">
            <q-btn flat dense icon="delete" color="negative" @click="removeVariant(index)" />
          </div>
        </div>

        <q-btn flat icon="add" label="Adicionar Variante" color="primary" @click="addVariant" />
      </div>

      <div class="system-dialog-footer">
        <q-btn flat label="Cancelar" class="dialog-cancel-btn" v-close-popup />

        <q-btn label="Salvar" class="dialog-save-btn" @click="save" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from 'src/stores/products'

const model = defineModel()

const props = defineProps({
  product: Object,
})

const productStore = useProductStore()

const form = ref({
  name: '',
  description: '',
  variants: [],
})

watch(
  () => props.product,
  (p) => {
    if (!p) {
      form.value = {
        name: '',
        description: '',
        variants: [],
      }
      return
    }

    form.value = {
      name: p.name || '',
      description: p.description || '',
      variants: p.variants
        .filter((v) => !p.editingVariant || v.id === p.editingVariant)
        .map((v) => ({
          id: v.id,
          name: v.name || '',
          price: v.prices?.[0]?.price ?? '',
          costPrice: v.prices?.[0]?.cost ?? '',
          stockQuantity: v.stockQuantity ?? '',
        })),
    }
  },
  { immediate: true },
)

function addVariant() {
  form.value.variants.push({
    name: '',
    price: 0,
    costPrice: 0,
    stockQuantity: 0,
  })
}

function removeVariant(i) {
  form.value.variants.splice(i, 1)
}

async function save() {
  const payload = {
    ...form.value,
    variants: form.value.variants.map((v) => ({
      id: v.id,
      name: v.name,
      stockQuantity: Number(v.stockQuantity) || 0,
      prices: [
        {
          price: Number(v.price) || 0,
          cost: Number(v.costPrice) || 0,
        },
      ],
    })),
  }

  if (props.product) {
    await productStore.updateProduct(props.product.id, payload)
  } else {
    await productStore.createProduct(payload)
  }

  model.value = false
}
</script>
