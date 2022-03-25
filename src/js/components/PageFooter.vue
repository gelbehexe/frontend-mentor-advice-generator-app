<template>
    <footer v-if="appData" class="attribution">
        <ul class="attribution__list">
            <li class="attribution__item">
                Challenge by
                <a
                    href="https://www.frontendmentor.io?ref=challenge"
                    target="_blank"
                    >Frontend Mentor</a
                >.
            </li>
            <li class="attribution__item">
                Coded by
                <a :href="appData.user.link">{{ appData.user.name }}</a>
            </li>
            <li class="attribution__item">
                Sourcecode at
                <a :href="appData.sourceCode.link">{{
                    appData.sourceCode.name
                }}</a>
            </li>
            <li class="attribution__item">Last Build: {{ build_time }}.</li>
        </ul>
    </footer>
</template>
<script setup>
import useAppData from "@/composition/useAppData"
import useBuildTime from "@/composition/useBuildTime"

const appData = useAppData()
const build_time = useBuildTime()
</script>

