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
                    <div class="flex flex-col gap-2 basis-1/2">
                        <div class="form-control">
                            <label class="label-text">Projektbeschreibung</label>
                            <textarea v-model.trim="descriptionInput" rows="8" class="textarea textarea-bordered" />
                        </div>
                        <button type="button" :disabled="reformulateDisabled" @click="improveDescription"
                            class="btn">Reformulieren</button>
                    </div>
                    <div class="flex flex-col gap-2 border p-4 rounded-lg grow">
                        <h4 class="font-bold"> Vorschlag </h4>
                        <span v-if="suggestionLoading"> Loading </span>
                        <div v-else class="flex flex-col grow">
                            <p class="grow" v-if="reformulateOngoing"> {{ descriptionSuggestion }}</p>
                            <p class="grow italic" v-if="!reformulateOngoing"> Hier gibt es nichts zu sehen. Gib eine
                                Beschreibung an und drücke reformulieren. </p>
                            <button :disabled="acceptDisabled" type="button" @click="acceptSuggestion"
                                class="btn btn-primary self-end justify-self-end">Akzeptieren</button>
                        </div>
                    </div>
                </div>
                <form @submit="addTechnology" class="flex flex-col gap-2">
                    <div class="flex gap-4">
                        <input v-model.trim="technologyInput" class="input input-bordered grow" />
                        <button type="submit" class="btn btn-primary"> + </button>
                    </div>
                    <ul class="flex gap-2">
                        <span class="badge badge-secondary" v-for="technology in technologies"> {{ technology }}</span>
                    </ul>
                </form>
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

const suggestionLoading = ref(false)
const descriptionSuggestion = ref('')
const reformulateOngoing = ref(false)

const nameInput = ref('')
const descriptionInput = ref('')
const technologyInput = ref('')
const technologies = ref<string[]>([])

const reformulateDisabled = computed(() => descriptionInput.value.length < 30 || descriptionInput.value === descriptionSuggestion.value)
const acceptDisabled = computed(() => descriptionSuggestion.value === '' || descriptionInput.value === descriptionSuggestion.value)
const submitDisabled = computed(() => nameInput.value === '' || descriptionInput.value === '')

const cvStore = useCvStore()

const addProjectEntry = (e: Event) => {
    e.preventDefault()
    cvStore.addProjectItem({ name: nameInput.value, description: descriptionInput.value, technologies: technologies.value })
    console.log(cvStore.projects)
}

const openai = new OpenAI({
    apiKey: runtime.public.openAiApiKey,
    dangerouslyAllowBrowser: true
})

const acceptSuggestion = () => {
    descriptionInput.value = descriptionSuggestion.value
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
