<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="login-card q-pa-lg">
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold">Açaí na Garrafa</div>
            <div class="text-subtitle2 text-grey">Sistema de Vendas</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="handleLogin">
              <q-input
                v-model="email"
                label="E-mail"
                type="email"
                outlined
                dense
                class="q-mb-md"
                :rules="[(val) => !!val || 'Informe o e-mail']"
              />

              <q-input
                v-model="password"
                label="Senha"
                type="password"
                outlined
                dense
                class="q-mb-md"
                :rules="[(val) => !!val || 'Informe a senha']"
              />

              <q-btn
                label="Entrar"
                type="submit"
                color="primary"
                class="full-width"
                :loading="loading"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
// import { useQuasar } from 'quasar'

const email = ref('')
const password = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()
// const $q = useQuasar()

const handleLogin = async () => {
  loading.value = true

  try {
    await authStore.login(email.value, password.value)
    window.alert('Login realizado com sucesso')
    // $q.notify({
    //   type: 'positive',
    //   message: 'Login realizado com sucesso!',
    // })

    router.push('/')
  } catch (error) {
    console.log(error)
    window.alert('Email ou senha invalidos')
    // $q.notify({
    //   type: 'negative',
    //   message: 'E-mail ou senha inválidos',
    // })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 350px;
}
</style>
