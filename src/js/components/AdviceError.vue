<template>
    <div class="advice-error">
        <div>{{ adviceErrorMsg }}</div>
    </div>
</template>
<script setup>
defineProps({
    adviceErrorMsg: {
        type: String,
        required: false,
        default: "",
    },
})
</script>
