<template>
    <ul class="grid grid-cols-1 gap-4">
        <li v-for="(project, index) in projects" :key="index" class="w-full bg-base-200 border rounded-md p-4">
            <h3 class="text-xl font-bold">
                {{ project.name }}
            </h3>
            <p class="my-2">
                {{ project.description }}
            </p>
            <ul class="flex gap-2 flex-wrap">
                <span class="badge badge-secondary p-1" v-for="(technology, index) in project.technologies"
                    :key="index">
                    {{ technology }}
                </span>
            </ul>
            <span class="flex gap-4 mt-2">
            <NuxtLink class=" link" v-if="project.repoUrl" :to="project.repoUrl.href">
                Repository
                </NuxtLink>
                <NuxtLink class="link" v-if="project.deploymentUrl" :to="project.deploymentUrl.href">
                    Deployment
                </NuxtLink>
            </span>
        </li>
    </ul>
</template>

<script setup lang="ts">
defineProps<{ projects: ProjectItem[] }>()
</script>
