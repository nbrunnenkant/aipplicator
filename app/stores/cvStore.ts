import { defineStore } from "pinia";
import { ref } from "vue";

export type EducationItem = {
  name: string,
  start: Date
  end: Date,
  degree: string,
  finalMark?: string
}

export const cvStore = defineStore("cvStore", () => {
    const education = ref<EducationItem[]>([])
})
