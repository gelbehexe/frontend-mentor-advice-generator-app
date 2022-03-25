import { ref } from "vue"

/**
 * @return {Ref<boolean>}
 */
export default function usePrefersReducedMotion() {
    const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)")

    const prefersReducedMotion = ref(mediaQueryList.matches)

    mediaQueryList.addEventListener("change", (ev) => {
        prefersReducedMotion.value = ev.matches
    })

    // noinspection JSValidateTypes
    return prefersReducedMotion
}
