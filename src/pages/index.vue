<template>
  <Card :description="auth.token" img-source="https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg"/>
</template>

<script lang="ts" setup>
import Card from "@/components/Card.vue";
import {useAuthStore} from "@/store/AuthStore";
import {onMounted} from "vue";

const auth = useAuthStore()

onMounted( () => {
    auth.login("dev+grower@progeser.com","password")
}
)
</script>
