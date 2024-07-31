<template>
    <div class="flex flex-col gap-4">
        <ProjectForm />
        <ProjectList :projects="projects" />
    </div>
</template>

<script setup lang="ts">
const { projects } = storeToRefs(useCvStore())
</script>
