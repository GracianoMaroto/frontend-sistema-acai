<template>
  <q-layout>
    <q-page-container>
      <q-page class="login-page flex flex-center">
        <q-img :src="logomarca" style="width: 200px; height: 200px" />
        <q-card class="login-card">
          <q-card-section class="login-header text-center">
            <div class="login-title">Açaí na Garrafa</div>

            <div class="login-subtitle">Sistema de Vendas</div>
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

              <q-btn label="Entrar" type="submit" class="login-btn full-width" :loading="loading" />
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
import logomarca from 'assets/LogomarcaAçai.png'
import { notifyError, notifySuccess } from 'src/utils/notify'

const email = ref('')
const password = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true

  try {
    await authStore.login(email.value, password.value)
    await router.push('/')
    notifySuccess('Login realizado com sucesso')
  } catch (error) {
    console.log(error)
    notifyError('Email ou senha invalidos')
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
