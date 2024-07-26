<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h3 class="card-title">Projekteintrag hinzufügen</h3>
            <form @submit="sendToOpenAI" class="flex flex-col gap-4">
                <div class="form-control">
                    <label class="label-text">Projektname</label>
                    <input v-model="nameInput" class="input input-bordered" />
                </div>
                <div class="flex gap-4">
                    <div class="flex flex-col gap-2 grow">
                        <div class="form-control">
                            <label class="label-text">Projektbeschreibung</label>
                            <textarea v-model.trim="descriptionInput" rows="8" class="textarea textarea-bordered" />
                        </div>
                        <button v-if="!reformulateOngoing || suggestionLoading" type="button" :disabled="reformulateDisabled"
                            @click="improveDescription" class="btn">
                            <span v-if="suggestionLoading"> Loading... </span>
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
                <form @submit="addTechnology" class="flex flex-col gap-2">
                    <div class="flex gap-4">
                        <div class="form-control grow">
                            <label class="label-text"> Technologien </label>
                            <input v-model.trim="technologyInput" class="input input-bordered" />
                        </div>
                        <button type="submit" class="btn btn-primary self-end"> + </button>
                    </div>
                    <ul class="flex gap-2">
                        <span class="badge badge-secondary" v-for="technology in technologies"> {{ technology }}</span>
                    </ul>
                </form>
                <div class="form-control">
                    <label class="label-text"> Repo-URL </label>
                    <input class="input input-bordered" v-model.trim="repoUrlInput" />
                </div>
                <div class="form-control">
                    <label class="label-text"> Deployment-URL </label>
                    <input class="input input-bordered" v-model.trim="deploymentUrlInput" />
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

const nameInput = ref('')
const descriptionInput = ref('')
const technologyInput = ref('')
const repoUrlInput = ref('')
const deploymentUrlInput = ref('')
const technologies = ref<string[]>([])

const reformulateDisabled = computed(() => descriptionInput.value.length < 30 || descriptionInput.value === descriptionSuggestion.value)
const submitDisabled = computed(() => nameInput.value === '' || descriptionInput.value === '')

const cvStore = useCvStore()

const addProjectEntry = (e: Event) => {
    e.preventDefault()
    cvStore.addProjectItem({
        name: nameInput.value,
        description: descriptionInput.value,
        technologies: technologies.value,
        repoUrl: new URL(repoUrlInput.value) ?? undefined,
        deploymentUrl: new URL(deploymentUrlInput.value) ?? undefined
    })
}

const openai = new OpenAI({
    apiKey: runtime.public.openAiApiKey,
    dangerouslyAllowBrowser: true
})

const acceptSuggestion = () => {
    reformulateOngoing.value = false
}

const declineSuggestion = () => {
    descriptionInput.value = descriptionTemp
    reformulateOngoing.value = false
}

const addTechnology = (e: Event) => {
    e.preventDefault()
    technologies.value.push(technologyInput.value)
    technologyInput.value = ''
}

const improveDescription = async () => {
    suggestionLoading.value = true
    reformulateOngoing.value = true
    const { reworkedDescription } = await sendToOpenAI()
    suggestionLoading.value = false
    descriptionSuggestion.value = reworkedDescription
    descriptionTemp = descriptionInput.value
    descriptionInput.value = reworkedDescription
}

const sendToOpenAI = async (): Promise<{ reworkedDescription: string }> => {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a master at creating and reformulating cv related stuff. Use as many buzzwords as you like. You will receive a coding-project. Please make it seem like said project was really well done" },
            { role: "system", content: "You are designed to output only JSON in the format: {\"reworkedDescription\": \"string\"}" },
            { role: "user", content: `I worked on a project named ${nameInput.value} with the description ${descriptionInput.value}. Please reformulate the description to fit on my resume. Please answer in german` }
        ],
        model: "gpt-4o-mini",
    });

    console.log(completion)
    const description = JSON.parse(completion.choices[0]?.message.content ?? "")
    return { ...description }
}
</script>
