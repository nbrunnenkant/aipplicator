<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h3 class="card-title">Projekteintrag hinzufügen</h3>
            <form @submit.prevent="sendToOpenAI" class="flex flex-col gap-4">
                <div class="form-control">
                    <label class="label-text">Projektname</label>
                    <input v-model.trim="projectItem.name" class="input input-bordered" />
                </div>
                <div class="flex gap-4">
                    <div class="flex flex-col gap-2 grow">
                        <div class="form-control">
                            <label class="label-text">Projektbeschreibung</label>
                            <textarea v-model.trim="projectItem.description" rows="8"
                                class="textarea textarea-bordered" />
                        </div>
                        <button v-if="!reformulateOngoing || suggestionLoading" type="button"
                            :disabled="reformulateDisabled" @click="improveDescription" class="btn">
                            <span v-if="suggestionLoading" class="loading loading-dots"> </span>
                            <span v-else> Reformulieren </span>
                        </button>
                        <div v-if="reformulateOngoing && !suggestionLoading" class="flex col-2 gap-4">
                            <button @click="declineSuggestion" class="btn btn-error grow" type="button"> Ablehnen
                            </button>
                            <button @click="acceptSuggestion" class="btn btn-success grow" type="button"> Annehmen
                            </button>
                        </div>
                    </div>
                </div>
                <form @submit.prevent="addTechnology" class="flex flex-col gap-2">
                    <div class="flex gap-4">
                        <div class="form-control grow">
                            <label class="label-text"> Technologien </label>
                            <input v-model.trim="technologyInput" class="input input-bordered" />
                        </div>
                        <button type="submit" class="btn btn-primary self-end"> + </button>
                    </div>
                    <ul class="flex gap-2 flex-wrap">
                        <span class="badge badge-secondary h-8" v-for="(technology, index) in projectItem.technologies"
                            :key="index">
                            <span>
                                <button type="button" class="btn btn-secondary rounded-full btn-xs"
                                    @click="removeTechnology(index)"> x </button>
                                {{ technology }}
                            </span>
                        </span>
                    </ul>
                </form>
                <div class="form-control">
                    <label class="label-text"> Repo-URL </label>
                    <input type="url" class="input input-bordered" v-model.trim="repoUrlInput" />
                </div>
                <div class="form-control">
                    <label class="label-text"> Deployment-URL </label>
                    <input type="url" class="input input-bordered" v-model.trim="deploymentUrlInput" />
                </div>
                <button @click="addProjectEntry" type="submit" class="btn btn-primary" :disabled="submitDisabled">
                    Hinzufügen
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import OpenAI from 'openai';

const runtime = useRuntimeConfig()

let descriptionTemp = ''

const suggestionLoading = ref(false)
const descriptionSuggestion = ref('')
const reformulateOngoing = ref(false)

const technologyInput = ref('')
const repoUrlInput = ref('')
const deploymentUrlInput = ref('')

const projectItem = ref<ProjectItem>({
    name: '',
    description: '',
    technologies: [],
})

const reformulateDisabled = computed(() => projectItem.value.description.length < 30 || projectItem.value.description === descriptionSuggestion.value)
const submitDisabled = computed(() =>
    projectItem.value.name === ''
    || projectItem.value.description === ''
    || (repoUrlInput.value !== '' && !URL.canParse(repoUrlInput.value))
    || (deploymentUrlInput.value !== '' && !URL.canParse(deploymentUrlInput.value)))

const cvStore = useCvStore()

const addProjectEntry = () => {
    cvStore.addProjectItem({
        ...projectItem.value,
        repoUrl: repoUrlInput.value ? new URL(repoUrlInput.value) : undefined,
        deploymentUrl: deploymentUrlInput.value ? new URL(deploymentUrlInput.value) : undefined
    })

    projectItem.value = {
        name: '',
        description: '',
        technologies: [],
    }
    repoUrlInput.value = ''
    deploymentUrlInput.value = ''
    technologyInput.value = ''
}

const openai = new OpenAI({
    apiKey: runtime.public.openAiApiKey,
    dangerouslyAllowBrowser: true
})

const acceptSuggestion = () => {
    reformulateOngoing.value = false
}

const declineSuggestion = () => {
    projectItem.value.description = descriptionTemp
    reformulateOngoing.value = false
}

const addTechnology = () => {
    projectItem.value.technologies.push(technologyInput.value)
    technologyInput.value = ''
}

const removeTechnology = (index: number) => {
    projectItem.value.technologies = projectItem.value.technologies.filter((_, idx) => idx !== index)
}

const improveDescription = async () => {
    suggestionLoading.value = true
    reformulateOngoing.value = true
    const { reworkedDescription } = await sendToOpenAI()
    suggestionLoading.value = false
    descriptionSuggestion.value = reworkedDescription
    descriptionTemp = projectItem.value.description
    projectItem.value.description = reworkedDescription
}

const sendToOpenAI = async (): Promise<{ reworkedDescription: string }> => {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a master at creating and reformulating cv related stuff. Use as many buzzwords as you like. You will receive a coding-project. Please make it seem like said project was really well done" },
            { role: "system", content: "You are designed to output only JSON in the format: {\"reworkedDescription\": \"string\"}" },
            { role: "user", content: `I worked on a project named ${projectItem.value.name} with the description ${projectItem.value.description}. Please reformulate the description to fit on my resume. Please answer in german` }
        ],
        model: "gpt-4o-mini",
    });

    const description = JSON.parse(completion.choices[0]?.message.content ?? "")
    return { ...description }
}
</script>
