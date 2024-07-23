import { defineStore } from "pinia";
import { ref } from "vue";

export type EducationItem = {
    name: string,
    start: Date
    end: Date,
    degree: string,
    finalMark?: string
}

export const useCvStore = defineStore("cvStore", () => {
    const education = ref<EducationItem[]>([])

    function addEducationItem(item: EducationItem) {
        education.value.push(item)
    }

    return { education, addEducationItem }
})
