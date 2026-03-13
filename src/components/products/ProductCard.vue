<template>
  <q-card class="product-card q-mb-md">
    <q-card-section class="row items-center justify-between">
      <div class="user-name">
        {{ product.name }}
      </div>
      <div>
        <q-btn flat round icon="edit" color="primary" @click="$emit('edit', product)" />
        <q-btn flat round icon="delete" color="negative" @click="$emit('delete', product)" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <VariantCard
        v-for="variant in product.variants"
        :key="variant.id"
        :variant="variant"
        @edit="editVariant"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import VariantCard from './VariantCard.vue'

const props = defineProps({
  product: Object,
})

const emit = defineEmits(['edit', 'delete'])

function editVariant() {
  emit('edit', props.product)
}
</script>
