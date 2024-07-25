<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h3 class="card-title">Projekteintrag hinzufügen</h3>
            <form @submit="sendToOpenAI" class="flex flex-col gap-4">
                <div class="form-control">
                    <label class="label-text">Projektname</label>
                    <input v-model="nameInput" class="input input-bordered" />
                </div>
                <div class="form-control">
                    <label class="label-text">Projektbeschreibung</label>
                    <textarea v-model="descriptionInput" class="textarea textarea-bordered" />
                </div>
                <button type="submit" class="btn btn-primary"> Hinzufügen </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import OpenAI from 'openai';

const runtime = useRuntimeConfig()

const nameInput = ref('')
const descriptionInput = ref('')

const openai = new OpenAI({
    apiKey: runtime.public.openAiApiKey,
    dangerouslyAllowBrowser: true
})

const sendToOpenAI = async () => {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a master at creating and reformulating cv related stuff. Use as many buzzwords as you like. You will receive a coding-project. Please make it seem like said project was really well done" },
            { role: "system", content: "You are designed to output only JSON in the format: {'reworkedDescription': string}" },
            { role: "user", content: `I worked on a project named ${nameInput.value} with the description ${descriptionInput.value}. Please reformulate the description to fit on my resume.` }
        ],
        model: "gpt-4o-mini",
    });
    console.log(completion.choices[0]?.message.content);
}
</script>
