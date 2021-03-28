<template>
    <div id="video-container" v-if="connected">
        <div id="local-video"></div>
        <div id="remote-video"></div>

        <div class="agora-call-action-btns">
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

    props: [
        'channelName'
    ],

    mounted() {
        store.commit('setChannelName', this.channelName);
        store.commit('joinEchoChannel');
    },

    computed: {
        ...mapState([
            'agoraClient',
            'connected',
            'transmitAudio',
            'transmitVideo',
        ]),
    },
}
</script>

<style scoped>

</style>
