<template>
    <ul class="timeline timeline-vertical">
        <li v-for="(item, index) in items">
            <hr v-if="index !== 0" />
            <div class="timeline-middle">
                <div class="rounded-full w-3 h-3 bg-base-300"></div>
            </div>
            <div :class="[{'timeline-start': index % 2 == 0, 'timeline-end': index % 2 !== 0}, 'mx-4']">
                <time class="font-mono italic"> {{ item.start.getFullYear() }} - {{ item.end.getFullYear() }}</time>
                <div class="font-bold text-3xl">{{ item.name }}</div>
                <div class="flex justify-between mt-2">
                    <span>{{ item.degree }}</span>
                    <span v-if="item.finalMark" class="badge badge-secondary"> Note: {{ item.finalMark }} </span>
                </div>
            </div>
            <hr v-if="index !== items.length - 1" />
        </li>
    </ul>
</template>

<script setup lang="ts">

defineProps<{ items: EducationItem[] }>()
</script>
