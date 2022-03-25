import { onMounted, reactive, ref } from "vue"
import { loadAdvice } from "@/lib/adviceProvider"
import usePrefersReducedMotion from "@/composition/usePrefersReducedMotion"

/**
 * @typedef AdviceSlip
 * @property {Number} id
 * @property {string} advice
 */

// noinspection JSValidateJSDoc
/**
 * @return {{isLoading: Ref<UnwrapRef<boolean>>, loadAdviceEventHandler: ((function(): Promise<void>)|*), slip: UnwrapNestedRefs<AdviceSlip>, setContentRef: setContentRef, animatePhase: Ref<UnwrapRef<string>>, shadowSlip: UnwrapNestedRefs<AdviceSlip>, adviceErrorMsg: RefTypes.Ref<UnwrapRef<string>>}}
 */
export default function useAdvice() {
    const isLoading = ref(true)

    // noinspection JSValidateJSDoc,JSValidateTypes
    /**
     * @type {Ref<UnwrapRef<string>>}
     */
    const adviceErrorMsg = ref("")

    // noinspection JSValidateTypes
    /**
     * @type {Ref<null|HTMLElement>}
     */
    const contentRef = ref(null)

    // noinspection JSValidateTypes
    /**
     * @type {Ref<null|HTMLElement>}
     */
    const shadowRef = ref(null)

    // noinspection JSValidateJSDoc,JSValidateTypes
    /**
     * @type {UnwrapNestedRefs<AdviceSlip>}
     */
    const slip = reactive({
        id: 0,
        advice: "",
    })

    // noinspection JSValidateJSDoc,JSValidateTypes
    /**
     * @type {UnwrapNestedRefs<AdviceSlip>}
     */
    const shadowSlip = reactive({
        id: 0,
        advice: "",
    })

    function setNewAdvice(slip, id, advice) {
        slip.id = id
        slip.advice = advice
    }

    const prefersReducedMotion = usePrefersReducedMotion()
    const animatePhase = ref("none")

    let readyForIn = 0

    function _incrementReadyForIn() {
        readyForIn++
        if (readyForIn === 2) {
            setTimeout(() => {
                // noinspection JSUnresolvedVariable
                setNewAdvice(slip, shadowSlip.id, shadowSlip.advice)
                _playAnimationPhase2()
            }, 100)
        }
    }

    function _shouldAnimate() {
        return slip.id !== 0 && !prefersReducedMotion.value
    }

    function _playAnimationPhase1() {
        readyForIn = 0

        contentRef.value.style.height = window.getComputedStyle(
            contentRef.value
        ).height

        contentRef.value.addEventListener(
            "animationend",
            () => {
                // condition 1/2 for next animate phase
                _incrementReadyForIn()
            },
            {
                once: true,
                capture: false,
            }
        )
        animatePhase.value = "out"
    }

    function _playAnimationPhase2() {
        contentRef.value.style.height = window.getComputedStyle(
            shadowRef.value
        ).height
        animatePhase.value = "in"
        contentRef.value.addEventListener(
            "animationend",
            () => {
                contentRef.value.removeAttribute("style")
                animatePhase.value = "none"
            },
            {
                once: true,
                capture: false,
            }
        )
    }

    async function loadAdviceEventHandler() {
        isLoading.value = true

        if (_shouldAnimate()) {
            _playAnimationPhase1()
        }

        try {
            const { id, advice } = await loadAdvice()
            setTimeout(() => {
                if (_shouldAnimate()) {
                    setNewAdvice(shadowSlip, id, advice)

                    // condition 2/2 for next animate phase / delayed
                    _incrementReadyForIn()
                } else {
                    setNewAdvice(slip, id, advice)
                }
            })
        } catch (err) {
            adviceErrorMsg.value = "Error loading advice"
        } finally {
            isLoading.value = false
        }
    }

    function setContentRef(newContentRef, shadow) {
        if (shadow) {
            shadowRef.value = newContentRef.value
            return
        }
        contentRef.value = newContentRef.value
    }

    onMounted(async () => {
        await loadAdviceEventHandler()
    })

    // noinspection JSValidateTypes
    return {
        adviceErrorMsg,
        isLoading,
        slip,
        shadowSlip,
        loadAdviceEventHandler,
        setContentRef,
        animatePhase,
    }
}
