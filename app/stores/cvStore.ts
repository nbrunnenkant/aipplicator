import { defineStore } from "pinia";
import { ref } from "vue";

export type EducationItem = {
    name: string,
    start: Date
    end: Date,
    degree: string,
    finalMark?: string
}

export type ProjectItem = {
    name: string,
    description: string,
    technologies: string[]
    repoUrl?: URL,
    deploymentUrl?: URL
}

export const useCvStore = defineStore("cvStore", () => {
    const education = ref<EducationItem[]>([])
    const projects = ref<ProjectItem[]>([])

    function addEducationItem(item: EducationItem) {
        education.value.push(item)
    }

    function addProjectItem(item: ProjectItem) {
        projects.value.push(item)
    }

    return { education, projects, addEducationItem, addProjectItem }
})
