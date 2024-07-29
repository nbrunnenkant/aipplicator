<template>
    <div class="flex flex-col gap-4">
        <ProjectForm />
        <ProjectList :projects="projects" />
    </div>
</template>

<script setup lang="ts">
import ProjectForm from '~/components/projects/ProjectForm.vue';
import ProjectList from '~/components/projects/ProjectList.vue';

const { projects } = storeToRefs(useCvStore())
</script>
