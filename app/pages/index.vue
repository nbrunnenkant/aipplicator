<template>
    <main class="w-full h-full flex flex-col gap-12">
        <EducationForm @create-education-entry="handleCreateEducationItem" />
        <EducationTimeline :items="timeline" />
    </main>
</template>

<script setup lang="ts">
import EducationForm from '~/components/education/EducationForm.vue';

const education = ref<EducationItem[]>([])

const timeline = computed(() => {
    return education.value.sort((a, b) => {
        return a.end.getTime() - b.end.getTime()
    })
})

const handleCreateEducationItem = (item: EducationItem) => {
    education.value.push(item)
}
</script>
