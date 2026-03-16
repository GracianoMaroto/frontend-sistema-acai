<template>
  <q-page class="row">
    <!-- COLUNA PRODUTOS -->
    <div class="col-12 col-md-8 q-pa-md">
      <!-- CANAL -->
      <div class="q-gutter-sm">
        <q-select
          class="system-select"
          v-model="order.customerId"
          :options="customerOptions"
          dense
          label="Cliente"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          outlined
          use-input
          input-debounce="400"
          @filter="filterCustomers"
          ><template v-slot:append>
            <q-btn
              icon="person_add"
              flat
              round
              size="sm"
              @click.stop="openCustomerDialog"
            /> </template
        ></q-select>
        <q-select
          class="system-select q-mb-md"
          v-model="order.saleChannelId"
          :options="saleChannelOptions"
          label="Canal de Venda"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          outlined
        />
      </div>

      <div v-if="order.saleChannelId">
        <q-card
          v-for="variant in productVariants"
          :key="variant.id"
          class="product-variant-card q-mb-sm"
          clickable
          @click="addItem(variant)"
        >
          <q-card-section class="product-variant-body">
            <div class="variant-name">
              {{ variant.name }}
            </div>

            <div class="variant-meta">
              <span class="variant-price"> R$ {{ Number(variant.price).toFixed(2) }} </span>

              <span class="variant-stock" :class="{ low: variant.stockQuantity <= 5 }">
                Estoque: {{ variant.stockQuantity }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="col-12 col-md-4 q-pa-md">
      <q-card class="cart-card full-heigth">
        <q-card-section class="cart-header">
          <div class="cart-title">Carrinho</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="cart-scroll">
          <div v-if="order.items.length === 0" class="text-grey text-center q-pa-md">
            Nenhum item adicionado
          </div>

          <q-card
            v-for="item in order.items"
            :key="item.productVariantId"
            flat
            bordered
            class="cart-item q-mb-sm"
          >
            <q-card-section class="row items-center justify-between">
              <div class="text-weight-medium">
                {{ getVariantName(item.productVariantId) }}
              </div>

              <div class="row items-center">
                <q-btn dense round flat icon="remove" @click="decrease(item)" />

                <div class="q-mx-sm text-weight-medium">
                  {{ item.quantity }}
                </div>

                <q-btn dense round flat icon="add" @click="increase(item)" />
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-separator />

        <!-- TOTAL -->
        <q-card-section>
          <div class="cart-total">
            <div>Total</div>
            <div>R$ {{ finalTotal.toFixed(2) }}</div>
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-select
            class="system-select"
            v-model="selectedPaymentMethod"
            :options="paymentMethods"
            label="Forma de Pagamento"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            outlined
            dense
          />
          <q-input v-model.number="discount" label="Desconto" prefix="R$" outlined dense />

          <q-input
            v-model.number="paymentAmount"
            label="Valor Pago"
            prefix="R$"
            step="0.1"
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions class="q-pa-md">
          <q-btn
            label="Finalizar Pedido"
            class="full-width primary-btn"
            size="lg"
            :disable="!canFinalize || submitting"
            :loading="submitting"
            @click="submitOrder"
          />
        </q-card-actions>
      </q-card>
    </div>
    <q-dialog v-model="customerDialog" persistent>
      <q-card class="system-dialog" style="width: 480px; max-width: 95vw">
        <div class="system-dialog-header">
          <div class="system-dialog-title">Novo Cliente</div>
        </div>

        <div class="system-dialog-body q-gutter-md">
          <q-input v-model="customerForm.name" label="Nome" outlined dense />

          <q-input v-model="customerForm.phone" label="Telefone" outlined dense />

          <q-input v-model="customerForm.street" label="Rua" outlined dense />

          <div class="row">
            <div class="col q-mr-sm">
              <q-input v-model="customerForm.number" label="Número" outlined dense />
            </div>

            <div class="col">
              <q-input v-model="customerForm.zipCode" label="CEP" outlined dense />
            </div>
          </div>

          <div class="row">
            <div class="col q-mr-sm">
              <q-input v-model="customerForm.city" label="Cidade" outlined dense />
            </div>

            <div class="col">
              <q-input v-model="customerForm.state" label="Estado" outlined dense />
            </div>
          </div>
        </div>

        <div class="system-dialog-footer">
          <q-btn flat label="Cancelar" v-close-popup class="dialog-cancel-btn" />

          <q-btn label="Salvar" class="dialog-save-btn" @click="createCustomer" />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersStore } from 'stores/orders'
import { useProductStore } from 'stores/products'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'
import { watch } from 'vue'
import { api } from 'src/boot/axios'
import { notifyError, notifySuccess } from 'src/utils/notify'
import { confirmDialog } from 'src/utils/confirm'

const router = useRouter()
// const $q = useQuasar()

const orderStore = useOrdersStore()
const productStore = useProductStore()
const submitting = ref(false)
const channelPrices = ref([])
const selectedPaymentMethod = ref(null)
const paymentAmount = ref(0)
const paymentMethods = ref([])
const customerOptions = ref([])
const customerDialog = ref(false)
const discount = ref(0)

const customerForm = ref({
  name: '',
  phone: '',
  street: '',
  number: '',
  city: '',
  state: '',
  zipCode: '',
})

const openCustomerDialog = () => {
  customerForm.value = {
    name: '',
    phone: '',
    street: '',
    number: '',
    city: '',
    state: '',
    zipCode: '',
  }

  customerDialog.value = true
}

const loadPaymentMethods = async () => {
  try {
    const res = await api.get('/payment-methods')
    paymentMethods.value = res.data
  } catch (err) {
    console.error('Erro ao carregar formas de pagamento', err)
  }
}

const createCustomer = async () => {
  const { data } = await api.post('/customers', customerForm.value)

  customerOptions.value.push(data)

  order.value.customerId = data.id

  customerDialog.value = false
}
const filterCustomers = async (val, update) => {
  const { data } = await api.get('/customers', {
    params: { search: val },
  })

  update(() => {
    customerOptions.value = data
  })
}

const order = ref({
  saleChannelId: null,
  customerId: null,
  items: [],
})

const productVariants = computed(() => {
  const channel = saleChannelOptions.value.find((c) => c.id === order.value.saleChannelId)

  return channelPrices.value
    .filter((price) => price.productVariant?.active !== false)
    .map((price) => {
      let finalPrice = Number(price.price)

      if (channel?.modifierType === 'MARKUP') {
        finalPrice = finalPrice * (1 + Number(channel.priceModifier) / 100)
      }

      if (channel?.modifierType === 'DISCOUNT') {
        finalPrice = finalPrice * (1 - Number(channel.priceModifier) / 100)
      }

      return {
        ...price.productVariant,
        price: finalPrice,
      }
    })
})
const saleChannelOptions = computed(() => orderStore.saleChannels)
const canFinalize = computed(() => {
  if (!order.value.saleChannelId) return false
  if (!order.value.items.length) return false

  if (selectedPaymentMethod.value && paymentAmount.value > total.value) {
    return false
  }

  return true
})

const addItem = (variant) => {
  const existing = order.value.items.find((i) => i.productVariantId === variant.id)

  if (existing) {
    if (existing.quantity >= variant.stockQuantity) {
      notifyError('Estoque máximo atingido')
      return
    }

    existing.quantity++
  } else {
    if (variant.stockQuantity <= 0) {
      notifyError('Produto sem estoque')
      return
    }

    order.value.items.push({
      productVariantId: variant.id,
      quantity: 1,
    })
  }
}

const increase = (item) => {
  const variant = productVariants.value.find((v) => v.id === item.productVariantId)

  if (!variant) return

  if (item.quantity >= variant.stockQuantity) {
    notifyError('Estoque máximo atingido')
    return
  }

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
const total = computed(() => {
  return order.value.items.reduce((sum, item) => {
    const variant = productVariants.value.find((v) => v.id === item.productVariantId)

    if (!variant) return sum

    return sum + Number(variant.price) * item.quantity
  }, 0)
})
const finalTotal = computed(() => {
  const result = total.value - discount.value
  return result < 0 ? 0 : result
})
const submitOrder = async () => {
  try {
    submitting.value = true

    const payload = {
      saleChannelId: order.value.saleChannelId,
      customerId: order.value.customerId || undefined,
      totalAmount: Number(finalTotal.value.toFixed(2)),
      items: order.value.items.map((i) => ({
        productVariantId: i.productVariantId,
        quantity: Number(i.quantity),
      })),
      payments:
        selectedPaymentMethod.value && paymentAmount.value > 0
          ? [
              {
                paymentMethodId: selectedPaymentMethod.value,
                amount: paymentAmount.value,
              },
            ]
          : undefined,
    }

    const confirmed = await confirmDialog(
      'Criar Pedido',
      'Tem certeza que deseja criar este pedido?',
    )
    if (!confirmed) return
    try {
      await orderStore.createOrder(payload)
      notifySuccess('Pedido criado com sucesso')
    } catch (error) {
      console.log(error)
      notifyError('Houve um problema ao criar o pedido')
    }
    order.value = {
      saleChannelId: null,
      customerId: null,
      items: [],
    }

    selectedPaymentMethod.value = null
    paymentAmount.value = 0

    router.push('/orders')
  } catch (error) {
    notifyError(error.response?.data?.message || 'Erro ao criar pedido')
  } finally {
    submitting.value = false
  }
}

watch(
  () => order.value.saleChannelId,
  async (newChannel) => {
    if (!newChannel) return

    channelPrices.value = await productStore.fetchPricesByChannel(newChannel)
  },
)
onMounted(async () => {
  await productStore.fetchProducts()
  await orderStore.fetchSaleChannels()
  await loadPaymentMethods()
})
</script>
