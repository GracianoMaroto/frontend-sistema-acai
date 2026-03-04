<template>
  <q-page class="q-pa-md">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-overline user-name">Gestão</div>
        <div class="text-h4 text-weight-bold user-name">Produtos</div>
      </div>

      <q-btn label="NOVO PRODUTO" icon="add" class="primary-btn" unelevated @click="openDialog()" />
    </div>

    <!-- TABELA -->
    <q-card class="table-card">
      <q-table
        :rows="productStore.products"
        :columns="columns"
        row-key="id"
        :loading="productStore.loading"
        :grid="$q.screen.lt.md"
        flat
      >
        <!-- Preço formatado -->
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <span class="text-weight-medium"> R$ {{ formatPrice(props.row.price) }} </span>
          </q-td>
        </template>

        <!-- Ações Desktop -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" color="black" @click="openDialog(props.row)" />
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

        <!-- Layout Mobile -->
        <template v-slot:item="props">
          <div class="col-12">
            <q-card class="product-card q-mb-md">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">
                  {{ props.row.name }}
                </div>

                <div class="text-caption text-grey-7 q-mt-xs">
                  {{ props.row.description }}
                </div>

                <div class="text-body1 text-weight-medium q-mt-sm user-name">
                  R$ {{ formatPrice(props.row.price) }}
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat icon="edit" color="icon-roxo" @click="openDialog(props.row)" />
                <q-btn flat icon="delete" color="negative" @click="deleteProduct(props.row.id)" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- DIALOG -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 420px" class="rounded-borders">
        <q-card-section>
          <div class="text-h6 text-weight-bold">
            {{ editing ? 'Editar Produto' : 'Novo Produto' }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Nome" outlined dense />

          <q-input v-model="form.description" label="Descrição" outlined dense />

          <q-input
            v-model.number="form.price"
            label="Preço"
            type="number"
            prefix="R$"
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="primary"
            unelevated
            :label="editing ? 'Atualizar' : 'Salvar'"
            @click="saveProduct"
          />
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
  if (!value || isNaN(value)) return '0,00'
  return Number(value).toFixed(2).replace('.', ',')
}
</script>
