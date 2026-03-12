<template>
  <q-layout view="lHh Lpr lFf" class="bg-bege">
    <q-header class="system-header">
      <q-toolbar class="q-px-lg">
        <q-btn flat round icon="menu" class="icon-bege" @click="toggleDrawer" />

        <div class="row items-center q-gutter-sm absolute-right">
          <q-avatar size="34px" class="avatar-roxo">
            {{ authStore.user?.name?.charAt(0) }}
          </q-avatar>

          <span class="user">
            {{ authStore.user?.name }}
          </span>

          <q-btn flat round icon="logout" class="icon-bege" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered class="system-drawer">
      <div class="column items-center q-pa-lg">
        <q-img :src="logomarca" style="width: 110px" fit="contain" />
      </div>

      <q-separator />

      <q-list padding>
        <q-item clickable to="/dashboard" v-if="authStore.isAdmin">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-weight-medium"> Dashboard </q-item-section>
        </q-item>

        <q-item clickable to="/products" v-if="authStore.isAdmin">
          <q-item-section avatar>
            <q-icon name="local_mall" />
          </q-item-section>
          <q-item-section class="text-weight-medium"> Produtos </q-item-section>
        </q-item>

        <q-item clickable to="/stock" v-if="authStore.isAdmin">
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section class="text-weight-medium"> Stock </q-item-section>
        </q-item>

        <q-item clickable to="/orders">
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section class="text-weight-medium"> Pedidos </q-item-section>
        </q-item>

        <q-item clickable to="/customers">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section class="text-weight-medium"> Clientes </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

import logomarca from '/src/assets/LogomarcaAçai.png'

import { notifyError, notifySuccess } from 'src/utils/notify'

const drawer = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const logout = async () => {
  try {
    authStore.logout()
    await router.push('/auth/login')
    notifySuccess('Logout realizado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Erro ao fazer logout')
  }
}
</script>
