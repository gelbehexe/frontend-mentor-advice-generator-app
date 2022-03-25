<template>
    <div
        class="lds-ring"
        :class="{
            'spinner-showing': loading,
        }"
        :style="{
            '--spinner-size': spinnerSize,
        }"
    >
        <div data-force-animation>
            <div data-force-animation></div>
            <div data-force-animation></div>
            <div data-force-animation></div>
            <div data-force-animation></div>
        </div>
    </div>
</template>
<script setup>
defineProps({
    loading: {
        type: Boolean,
        required: false,
        default: true,
    },
    spinnerSize: {
        type: String,
        required: false,
        default: "80px",
    },
})
</script>

<style scoped lang="scss">
// adopted from @link: https://loading.io/css/
.lds-ring {
    --spinner-size: 80px;
    --spinner-ring-width: calc(var(--spinner-size) / 10);
    --clr-spinner: currentColor;

    position: absolute;
    inset: 0;
    pointer-events: none;
    display: grid;
    place-content: center;

    opacity: 0;
    transition: opacity 100ms ease-in-out;

    &.spinner-showing {
        opacity: 1;
        transition: opacity 100ms ease-in-out;
    }
}

.lds-ring > div {
    display: inline-block;
    position: relative;
    width: var(--spinner-size);
    height: var(--spinner-size);
}
.lds-ring > div div {
    --_inner-width: calc(var(--spinner-size) - var(--spinner-ring-width) * 2);
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: var(--_inner-width);
    height: var(--_inner-width);
    margin: var(--spinner-ring-width);
    border: var(--spinner-ring-width) solid var(--clr-spinner);
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--clr-spinner) transparent transparent transparent;
}
.lds-ring > div div:nth-child(1) {
    animation-delay: -0.45s;
}
.lds-ring > div div:nth-child(2) {
    animation-delay: -0.3s;
}
.lds-ring > div div:nth-child(3) {
    animation-delay: -0.15s;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
