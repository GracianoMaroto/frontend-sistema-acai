<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5">Produtos</div>

      <q-btn label="Novo Produto" color="primary" icon="add" @click="openDialog()" />
    </div>

    <q-table
      title="Lista de Produtos"
      :rows="productStore.products"
      :columns="columns"
      row-key="id"
      :loading="productStore.loading"
      :grid="$q.screen.lt.md"
      flat
      bordered
    >
      <template v-slot:body-cell-price="props">
        <q-td :props="props"> R$ {{ formatPrice(props.row.price) }} </q-td>
      </template>

      <template v-slot:item="props">
        <div class="col-12">
          <q-card bordered flat class="q-mb-sm">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold">
                {{ props.row.name }}
              </div>

              <div class="text-caption q-mt-xs">
                {{ props.row.description }}
              </div>

              <div class="text-body2 q-mt-sm">💰 R$ {{ formatPrice(props.row.price) }}</div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat icon="edit" color="primary" @click="openDialog(props.row)" />
              <q-btn flat icon="delete" color="negative" @click="deleteProduct(props.row.id)" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round dense icon="edit" color="primary" @click="openDialog(props.row)" />
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click="deleteProduct(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Dialog -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editing ? 'Editar Produto' : 'Novo Produto' }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Nome" outlined />
          <q-input v-model="form.description" label="Descrição" outlined />
          <q-input v-model.number="form.price" label="Preço" type="number" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" :label="editing ? 'Atualizar' : 'Salvar'" @click="saveProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const productStore = useProductStore()

const dialog = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  name: '',
  description: '',
  price: 0,
})

const columns = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  { name: 'price', label: 'Preço', field: 'price', classes: $q.screen.lt.md ? 'hidden' : '' },
  { name: 'actions', label: 'Ações', field: 'actions', classes: $q.screen.lt.md ? 'hidden' : '' },
]

onMounted(() => {
  productStore.fetchProducts()
})

function openDialog(product = null) {
  if (product) {
    editing.value = true
    form.value = { ...product }
  } else {
    editing.value = false
    form.value = {
      id: null,
      name: '',
      description: '',
      price: 0,
    }
  }

  dialog.value = true
}

async function saveProduct() {
  if (editing.value) {
    await productStore.updateProduct(form.value.id, form.value)
  } else {
    await productStore.createProduct(form.value)
  }

  dialog.value = false
}

async function deleteProduct(id) {
  await productStore.deleteProduct(id)
}

function formatPrice(value) {
  return Number(value).toFixed(2)
}
</script>
