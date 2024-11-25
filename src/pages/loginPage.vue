<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="400">
      <v-card-title class="text-h6 text-center primary--text">Connection</v-card-title>
      <v-form @submit.prevent="handleLogin" ref="loginForm" class="pa-4">
        <h4 class="mr-2 align-self-center">Email</h4>
        <v-text-field
          v-model="email"
          type="email"
          variant="outlined"
          placeholder="uniser@uniser.com"
          required
          class="custom-input align-self-center mb-4"
        />
        <h4 class="mr-2 align-self-center">Mot de passe</h4>
        <v-text-field
          v-model="password"
          type="password"
          variant="outlined"
          placeholder="********"
          required
          class="custom-input align-self-center mb-4"
        />
        <v-btn
          class="mt-4"
          block
          color="primary"
          type="submit"
          :loading="isLoading"
        >
          Se connecter
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
      isLoading.value = true;
      try {
        await authStore.login(email.value, password.value);
        await router.push("/home");
      } catch (error) {
        alert("Erreur de connexion. Vérifiez vos identifiants.");
      } finally {
        isLoading.value = false;
      }
    };

    return { email, password, isLoading, handleLogin };
  },
});
</script>

<style scoped>

.primary--text {
  font-weight: bold;
  color:#ffffff;
  background-color: #008B8B;
}

</style>
