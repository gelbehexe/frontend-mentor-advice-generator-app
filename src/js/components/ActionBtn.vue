<template>
    <button class="action-btn" @click="onClickHandler">
        <span class="sr-only">Get random advice</span>
        <img
            aria-hidden="true"
            data-force-animation
            class="action-btn__dice"
            :src="iconDice"
            alt="A dice to get a random advice"
        />
    </button>
</template>
<script setup>
import iconDice from "../../assets/images/icon-dice.svg"

const emit = defineEmits(["buttonClicked"])

function onClickHandler() {
    emit("buttonClicked")
}
</script>
