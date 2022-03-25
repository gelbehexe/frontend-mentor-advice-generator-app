<template>
    <section class="box">
        <advice-content
            ref="contentComponentRef"
            aria-live="assertive"
            :aria-busy="isLoading || animatePhase !== 'none'"
            :slip="slip"
            :class="{
                'uninitialized': slip.id === 0,
                'loading': isLoading,
                'error': adviceErrorMsg,
                'phase-out': animatePhase === 'out',
                'phase-in': animatePhase === 'in',
            }"
            @content-ref-changed="setContentRef"
        ></advice-content>
        <advice-content
            aria-hidden="true"
            class="content--shadow"
            :slip="shadowSlip"
            :is-shadow="true"
            @content-ref-changed="setContentRef"
        ></advice-content>
        <action-btn
            :disabled="isLoading || animatePhase !== 'none'"
            @button-clicked="loadAdviceEventHandler"
        />
        <advice-error
            v-if="!isLoading && adviceErrorMsg"
            :advice-error-msg="adviceErrorMsg"
        />
        <spinner-indicator v-if="slip.id === 0" :loading="isLoading" />
    </section>
</template>

<script setup>
import ActionBtn from "@/components/ActionBtn"

import AdviceContent from "@/components/AdviceContent"
import SpinnerIndicator from "@/components/SpinnerIndicator"
import useAdvice from "@/composition/useAdvice"
import AdviceError from "@/components/AdviceError"

const {
    isLoading,
    slip,
    shadowSlip,
    loadAdviceEventHandler,
    adviceErrorMsg,
    setContentRef,
    animatePhase,
} = useAdvice()
</script>
<style scoped lang="scss">
</style>
