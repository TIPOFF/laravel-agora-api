<template>
    <div id="video-container" v-if="connected">
        <div id="local-video"></div>
        <div id="remote-video"></div>

        <div class="agora-call-actions">
            <button class="agora-btn-toggle-audio" @click="toggleAudio">
                {{ transmitAudio ? "Mute" : "Unmute" }}
            </button>

            <button class="agora-btn-toggle-video" @click="toggleVideo">
                {{ transmitVideo ? "Hide Video" : "Show Video" }}
            </button>

            <button class="agora-btn-hang-up" @click="hangUp">
                Hang Up
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "AgoraVideoDisplay",

    computed: {
        ...mapState([
            'connected',
            'transmitAudio',
            'transmitVideo',
        ]),
    },
}
</script>

<style scoped>

</style>
