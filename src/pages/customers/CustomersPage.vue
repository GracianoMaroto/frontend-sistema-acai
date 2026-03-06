<template>
  <q-page class="orders-page">
    <!-- HEADER -->
    <div class="user-name">Gestão</div>
    <div class="row items-center justify-between q-mb-lg">
      <div class="section-title">Clientes</div>
      <q-btn
        label="Cliente"
        icon="person_add"
        class="primary-btn"
        unelevated
        no-caps
        @click="openDialog()"
      />
    </div>

    <!-- BUSCA -->
    <q-input
      v-model="search"
      placeholder="Buscar por nome ou telefone"
      outlined
      rounded
      clearable
      dense
      class="q-mb-md"
      debounce="400"
      @update:model-value="fetchCustomers"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- TABELA -->
    <q-table
      :rows="customers"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :loading="loading"
      :grid="$q.screen.lt.md"
      class="system-table"
    >
      <!-- TELEFONE -->
      <template v-slot:body-cell-phone="props">
        <q-td :props="props">
          {{ props.row.phone || '-' }}
        </q-td>
      </template>

      <!-- NOME -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center q-gutter-sm">
            <q-avatar color="primary" text-color="white" size="32px">
              {{ props.row.name.charAt(0) }}
            </q-avatar>

            <div>
              <div class="text-weight-medium">
                {{ props.row.name }}
              </div>

              <div class="text-caption text-grey-6">
                {{ props.row.phone || 'Sem telefone' }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- CIDADE -->
      <template v-slot:body-cell-city="props">
        <q-td :props="props"> {{ props.row.city }} - {{ props.row.state }} </q-td>
      </template>

      <!-- AÇÕES -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row q-gutter-xs">
            <q-btn round dense flat icon="edit" color="primary" @click="openDialog(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>

            <q-btn
              round
              dense
              flat
              icon="delete"
              color="negative"
              @click="deleteCustomer(props.row.id)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
      <template v-slot:item="props">
        <div class="col-12">
          <q-card class="customer-card q-mb-md">
            <q-card-section class="row items-center q-gutter-md">
              <q-avatar color="primary" text-color="white">
                {{ props.row.name.charAt(0) }}
              </q-avatar>

              <div class="col">
                <div class="text-weight-bold">
                  {{ props.row.name }}
                </div>

                <div class="text-caption text-grey-7">
                  {{ props.row.phone || 'Sem telefone' }}
                </div>

                <div class="text-caption text-grey-6">
                  {{ props.row.city }} - {{ props.row.state }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn flat round icon="edit" color="user-name" @click="openDialog(props.row)" />

              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                @click="deleteCustomer(props.row.id)"
              />
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
            {{ editing ? 'Editar Cliente' : 'Novo Cliente' }}
          </div>
        </div>

        <!-- BODY -->
        <div class="system-dialog-body q-gutter-md">
          <q-input v-model="form.name" label="Nome" outlined dense />

          <q-input v-model="form.phone" label="Telefone" outlined dense />

          <q-input v-model="form.email" label="Email" outlined dense />

          <q-input v-model="form.street" label="Rua" outlined dense />

          <div class="row">
            <div class="col q-mr-sm">
              <q-input v-model="form.number" label="Número" outlined dense />
            </div>

            <div class="col">
              <q-input v-model="form.zipCode" label="CEP" outlined dense />
            </div>
          </div>

          <div class="row">
            <div class="col q-mr-sm">
              <q-input v-model="form.city" label="Cidade" outlined dense />
            </div>

            <div class="col">
              <q-input v-model="form.state" label="Estado" outlined dense />
            </div>
          </div>

          <q-input v-model="form.complement" label="Complemento" outlined dense />
        </div>

        <!-- FOOTER -->
        <div class="system-dialog-footer">
          <q-btn flat label="Cancelar" v-close-popup class="dialog-cancel-btn" />

          <q-btn
            :label="editing ? 'Atualizar' : 'Salvar'"
            @click="saveCustomer"
            class="dialog-save-btn"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { confirmDialog } from 'src/utils/confirm'

const customers = ref([])
const loading = ref(false)
const search = ref('')

const dialog = ref(false)
const editing = ref(false)

const form = ref({})

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left' },
  { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' },
  { name: 'city', label: 'Cidade', field: 'city', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const fetchCustomers = async () => {
  loading.value = true

  const { data } = await api.get('/customers', {
    params: { search: search.value },
  })

  customers.value = data
  loading.value = false
}

onMounted(fetchCustomers)

const openDialog = (customer = null) => {
  if (customer) {
    editing.value = true
    form.value = { ...customer }
  } else {
    editing.value = false
    form.value = {}
  }

  dialog.value = true
}

const saveCustomer = async () => {
  if (editing.value) {
    const confirmed = await confirmDialog(
      'Editar cliente',
      'Tem certeza que deseja editar este cliente?',
    )
    if (!confirmed) return
    try {
      await api.patch(`/customers/${form.value.id}`, form.value)
      notifySuccess('Cliente editado com sucesso')
      fetchCustomers()
    } catch (error) {
      console.log(error)
      notifyError('Houve um problema ao editar este cliente')
    }
  } else {
    const confirmed = await confirmDialog(
      'Cadastrar cliente',
      'Tem certeza que deseja cadastrar este cliente?',
    )
    if (!confirmed) return
    try {
      await api.post('/customers', form.value)
      notifySuccess('Cliente cadastrado com sucesso')
      fetchCustomers()
    } catch (error) {
      console.log(error)
      notifyError('Houve um problema ao cadastrar este cliente')
    }
  }

  dialog.value = false
  fetchCustomers()
}

const deleteCustomer = async (id) => {
  const confirmed = await confirmDialog(
    'Deletar cliente',
    'Tem certeza que deseja deletar este cliente?',
  )
  if (!confirmed) return
  try {
    await api.delete(`/customers/${id}`)
    notifySuccess('Cliente deletado com sucesso')
    fetchCustomers()
  } catch (error) {
    console.log(error)
    notifyError('Houve um problema ao deletar este cliente')
  }
}
</script>
