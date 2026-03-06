<template>
  <q-page class="orders-page">
    <!-- HEADER -->
    <div class="user-name">Gestão</div>

    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="section-title">Produtos</div>
      </div>

      <q-btn
        label="Produto"
        icon="add"
        no-caps
        class="primary-btn"
        unelevated
        @click="openDialog()"
      />
    </div>

    <!-- TABELA -->
    <q-table
      :rows="productStore.products"
      :columns="columns"
      row-key="id"
      :loading="productStore.loading"
      :grid="$q.screen.lt.md"
      flat
    >
      <!-- PREÇO -->
      <template v-slot:body-cell-basePrice="props">
        <q-td :props="props">
          <span class="text-weight-medium"> R$ {{ formatPrice(props.row.basePrice) }} </span>
        </q-td>
      </template>

      <!-- STATUS -->
      <template v-slot:body-cell-active="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.active ? 'positive' : 'negative'"
            :label="props.row.active ? 'Ativo' : 'Inativo'"
          />
        </q-td>
      </template>

      <!-- AÇÕES -->
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

      <!-- MOBILE CARD -->
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
                R$ {{ formatPrice(props.row.basePrice) }}
              </div>

              <q-badge
                class="q-mt-sm"
                :color="props.row.active ? 'positive' : 'negative'"
                :label="props.row.active ? 'Ativo' : 'Inativo'"
              />
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

    <!-- DIALOG -->
    <q-dialog v-model="dialog" persistent>
      <q-card class="system-dialog" style="width: 480px; max-width: 95vw">
        <!-- HEADER -->
        <div class="system-dialog-header">
          <div class="system-dialog-title">
            {{ editing ? 'Editar Produto' : 'Novo Produto' }}
          </div>
        </div>

        <!-- BODY -->
        <div class="system-dialog-body q-gutter-md">
          <q-input v-model="form.name" label="Nome" outlined dense />

          <q-input v-model="form.description" label="Descrição" outlined dense />

          <q-input
            v-model.number="form.basePrice"
            label="Preço de venda"
            type="number"
            prefix="R$"
            outlined
            dense
          />

          <q-input
            v-model.number="form.costPrice"
            label="Preço de custo"
            type="number"
            prefix="R$"
            outlined
            dense
          />

          <q-toggle v-model="form.active" label="Produto ativo" />
        </div>

        <!-- FOOTER -->
        <div class="system-dialog-footer">
          <q-btn flat label="Cancelar" v-close-popup class="dialog-cancel-btn" />

          <q-btn
            unelevated
            :label="editing ? 'Atualizar' : 'Salvar'"
            class="dialog-save-btn"
            @click="saveProduct"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'
import { useQuasar } from 'quasar'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { confirmDialog } from 'src/utils/confirm'

const $q = useQuasar()
const productStore = useProductStore()

const dialog = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  name: '',
  description: '',
  basePrice: 0,
  costPrice: 0,
  active: true,
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
  {
    name: 'basePrice',
    label: 'Preço',
    field: 'basePrice',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'active',
    label: 'Status',
    field: 'active',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    classes: $q.screen.lt.md ? 'hidden' : '',
  },
]

onMounted(() => {
  productStore.fetchProducts()
})

function openDialog(product = null) {
  if (product) {
    editing.value = true

    form.value = {
      id: product.id,
      name: product.name,
      description: product.description,
      basePrice: Number(product.basePrice),
      costPrice: Number(product.costPrice),
      active: product.active,
    }
  } else {
    editing.value = false

    form.value = {
      id: null,
      name: '',
      description: '',
      basePrice: 0,
      costPrice: 0,
      active: true,
    }
  }

  dialog.value = true
}

async function saveProduct() {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    basePrice: String(form.value.basePrice),
    costPrice: String(form.value.costPrice),
    active: form.value.active,
  }

  if (editing.value) {
    const confirmed = await confirmDialog(
      'Editar Produto',
      'Tem certeza que deseja editar este produto?',
    )
    if (!confirmed) return
    try {
      await productStore.updateProduct(form.value.id, payload)
      notifySuccess('Produto editado com sucesso')
    } catch (error) {
      console.log(error)
      notifyError('Houve um problema ao editar o produto')
    }
  } else {
    const confirmed = await confirmDialog(
      'Criar Produto',
      'Tem certeza que deseja criar este produto?',
    )
    if (!confirmed) return
    try {
      await productStore.createProduct(payload)
      notifySuccess('Produto criado com sucesso')
    } catch (error) {
      console.log(error)
      notifyError('Houve um problema ao criar o produto')
    }
  }

  await productStore.fetchProducts()

  dialog.value = false
}

async function deleteProduct(id) {
  const confirmed = await confirmDialog(
    'Excluir Produto',
    'Tem certeza que deseja excluir este produto?',
  )
  if (!confirmed) return
  try {
    await productStore.deleteProduct(id)
    notifySuccess('Produto deletado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao deletar o produto')
  }
}

function formatPrice(value) {
  if (!value) return '0,00'
  return Number(value).toFixed(2).replace('.', ',')
}
</script>
