<template>
    <div id="video-container" v-if="connected">
        <div id="local-video"></div>
        <div id="remote-video"></div>

        <div class="call-actions">
            <button type="button" @click="toggleAudio">
                {{ sendAudio ? "Mute" : "Unmute" }}
            </button>

            <button type="button" @click="toggleVideo">
                {{ sendVideo ? "Hide Video" : "Show Video" }}
            </button>

            <button type="button" @click="endCall">
                End Call
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "AgoraVideoDisplay",
}
</script>

<style scoped>

</style>
