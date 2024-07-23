<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h3 class="card-title"> Neuer Bildungseintrag </h3>
            <form @submit="handleSubmit" class="flex flex-col gap-4">
                <div class="form-control">
                    <label class="label-text">Name des Instituts</label>
                    <input class="input input-bordered" type="name" v-model="nameInput">
                </div>
                <div class="form-control">
                    <label class="label-text">Abschluss</label>
                    <input class="input input-bordered" type="name" v-model="degreeInput">
                </div>
                <div class="flex gap-4">
                    <div class="form-control grow">
                        <label class="label-text"> Start </label>
                        <input class="input input-bordered" type="date" v-model="startInput">
                    </div>
                    <span class="font-bold text-3xl self-center"> - </span>
                    <div class="form-control grow">
                        <label class="label-text"> Ende </label>
                        <input class="input input-bordered" type="date" v-model="endInput">
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="form-control">
                        <label class="label cursor-pointer justify-start gap-8">
                            <input type="checkbox" v-model="includeMark" class="checkbox" />
                            <span class="label-text">Abschlussnote angeben?</span>
                        </label>
                    </div>
                    <Transition name="fade">
                        <div class="form-control grow" v-if="includeMark">
                            <label class="label-text">Note</label>
                            <input class="input input-bordered" type="name" v-model="finalMarkInput">
                        </div>
                    </Transition>
                </div>
                <button class="btn btn-primary" type="submit"> Hinzufügen </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const nameInput = ref('')
const startInput = ref('')
const endInput = ref('')
const degreeInput = ref('')
const finalMarkInput = ref('')
const includeMark = ref(false)

const { addEducationItem } = useCvStore()

const handleSubmit = (e: Event) => {
    e.preventDefault()

    addEducationItem({
        name: nameInput.value,
        start: new Date(startInput.value),
        end: new Date(endInput.value),
        degree: degreeInput.value,
        finalMark: includeMark ? finalMarkInput.value : undefined
    })

    nameInput.value = ''
    startInput.value = ''
    endInput.value = ''
    degreeInput.value = ''
    finalMarkInput.value = ''
    includeMark.value = false
}
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.25s ease-out;
}
</style>
