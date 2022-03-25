<template>
    <header class="sr-only">
        <h1>{{ appData.title }}</h1>
    </header>
</template>
<script setup>
import useAppData from "@/composition/useAppData"

const appData = useAppData()
</script>
