<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleDrawer" />

        <q-toolbar-title> Açaí na Garrafa </q-toolbar-title>

        <div class="q-mr-md">
          {{ authStore.user?.name }}
        </div>

        <q-btn flat round dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
      <div class="text-center" style="color: blue">
        <q-img :src="logomarca" style="width: 150px; height: 150px" />
      </div>
      <q-list>
        <q-item clickable to="/dashboard" v-if="authStore.isAdmin">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section> Dashboard </q-item-section>
        </q-item>

        <q-item v-if="authStore.isAdmin" clickable to="/products">
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section> Produtos </q-item-section>
        </q-item>

        <q-item clickable to="/orders">
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section> Pedidos </q-item-section>
        </q-item>

        <q-item clickable to="/customers">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section> Clientes </q-item-section>
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

const drawer = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const logout = () => {
  try {
    authStore.logout()
    window.alert('Logout realizado com sucesso')
    router.push('/login')
    // $q.notify({
    //   type: 'positive',
    //   message: 'Logout realizado com sucesso!',
    // })
  } catch (error) {
    console.log(error)
    window.alert('Erro ao fazer logout')
    // $q.notify({
    //   type: 'negative',
    //   message: 'Errou ao fazer logout',
    // })
  }
}
</script>
