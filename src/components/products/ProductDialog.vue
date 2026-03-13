<template>
  <q-dialog v-model="model">
    <q-card class="system-dialog">
      <!-- HEADER -->
      <div class="system-dialog-header">
        <div class="system-dialog-title">
          {{ product ? 'Editar Produto' : 'Novo Produto' }}
        </div>
      </div>

      <!-- BODY -->
      <div class="system-dialog-body q-gutter-md">
        <q-input outlined v-model="form.name" label="Nome" />

        <q-input outlined v-model="form.description" label="Descrição" />

        <div class="section-subtitle">Variantes</div>

        <div
          v-for="(variant, index) in form.variants"
          :key="variant.localId"
          class="variant-editor"
        >
          <div class="row q-col-gutter-md">
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
              v-model.number="variant.cost"
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

          <!-- MÉTRICAS -->
          <div class="variant-metrics">
            <span>
              Lucro:
              <b :class="lucro(variant) >= 0 ? 'text-positive' : 'text-negative'">
                R$ {{ lucro(variant).toFixed(2) }}
              </b>
            </span>

            <span>
              Margem:
              <b>{{ margem(variant) }}%</b>
            </span>
          </div>
        </div>

        <q-btn flat icon="add" label="Adicionar Variante" color="primary" @click="addVariant" />
      </div>

      <!-- FOOTER -->
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

function createVariant(v = {}) {
  return {
    localId: crypto.randomUUID(),
    id: v.id,
    name: v.name || '',
    price: Number(v.prices?.[0]?.price) || 0,
    cost: Number(v.prices?.[0]?.cost) || 0,
    stockQuantity: Number(v.stockQuantity) || 0,
  }
}

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
      variants: p.variants.map(createVariant),
    }
  },
  { immediate: true },
)

function addVariant() {
  form.value.variants.push(createVariant())
}

function removeVariant(i) {
  form.value.variants.splice(i, 1)
}

function lucro(v) {
  return (v.price || 0) - (v.cost || 0)
}

function margem(v) {
  if (!v.price) return 0
  return Math.round(((v.price - v.cost) / v.price) * 100)
}

async function save() {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    variants: form.value.variants.map((v) => ({
      id: v.id,
      name: v.name,
      stockQuantity: Number(v.stockQuantity) || 0,
      prices: [
        {
          price: Number(v.price) || 0,
          cost: Number(v.cost) || 0,
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

<style scoped>
.variant-editor {
  padding: 12px;
  border-radius: 10px;
  background: #fafafa;
}

.variant-metrics {
  display: flex;
  gap: 20px;
  margin-top: 6px;
  font-size: 0.85rem;
}
</style>
