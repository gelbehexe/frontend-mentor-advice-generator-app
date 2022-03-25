<template>
    <article ref="contentRef" class="content">
        <h2 class="content__title" aria-relevant="all">
            <span class="content__title__text">Advice #{{ slip.id }}</span>
        </h2>
        <blockquote class="content__body" aria-relevant="all">
            <span class="content__body__text">{{ slip.advice }}</span>
        </blockquote>
        <div role="none" aria-hidden="true" class="content__decoration"></div>
    </article>
</template>
<script setup>
import { onMounted, ref } from "vue"

const emit = defineEmits(["contentRefChanged"])

const props = defineProps({
    slip: {
        type: Object,
        required: true,
    },
    isShadow: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const contentRef = ref(null)

onMounted(() => {
    if (!contentRef.value) {
        console.error("contentRef not set")
        return
    }

    emit("contentRefChanged", contentRef, props.isShadow)
})
</script>
<script>
export default {
    inheritAttrs: true,
}
</script>
<!--<script>-->
<!--// import usePrefersReducedMotion from "@/composition/usePrefersReducedMotion"-->

<!--import { onMounted, ref } from "vue"-->

<!--export default {-->
<!--    props: {-->
<!--        id: {-->
<!--            type: Number,-->
<!--            required: true,-->
<!--        },-->
<!--        advice: {-->
<!--            type: String,-->
<!--            required: true,-->
<!--        },-->
<!--    },-->
<!--    setup() {-->
<!--        const contentRef = ref(null)-->

<!--        onMounted(() => {-->
<!--            console.log("contentRef.value", contentRef.value)-->
<!--        })-->

<!--        return {-->
<!--            contentRef,-->
<!--        }-->
<!--    },-->
<!--}-->
<!--</script>-->
