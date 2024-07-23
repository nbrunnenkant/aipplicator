<template>
    <div class="flex justify-center">
        <div class="container p-4">
            <NuxtPage />
        </div>
    </div>
</template>

<style lang="css">
body {
    font-family: CommitMono;
}

@font-face {
    font-family: "CommitMono";
    src:
        url("~/assets/fonts/CommitMonoNerdFont-Regular.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFont-Italic.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFont-Bold.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFont-BoldItalic.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFontMono-Regular.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFontMono-Italic.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFontMono-Bold.otf") format("opentype"),
        url("~/assets/fonts/CommitMonoNerdFontMono-BoldItalic.otf") format("opentype");
}
</style>
