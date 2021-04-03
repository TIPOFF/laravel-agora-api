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

        <div>
            {{ transmitAudio }}
            {{ transmitVideo }}
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: "AgoraVideoDisplay",

    props: [
        'currentUserId',
        'currentUserName',
        'echoChannelName',
        'agoraRoutePrefix',
        'agoraAppId',
    ],

    mounted() {
        let currentUser = {};
        currentUser.id = this.currentUserId;
        currentUser.name = this.currentUserName;

        this.setCurrentUser(currentUser);
        this.setAgoraRoutePrefix(this.agoraRoutePrefix);

        this.setEchoChannelName(this.echoChannelName);
        this.joinEchoChannel();

        this.setEchoChannelUserListeners();
    },

    methods: {
        ...mapMutations({
            setCurrentUser: 'agora/setCurrentUser',
            initializeAgoraClient: 'agora/initializeAgoraClient',
            setAgoraRoutePrefix: 'agora/setAgoraRoutePrefix',
            setEchoChannelName: 'agora/setEchoChannelName',
            joinEchoChannel: 'agora/joinEchoChannel',
            setEchoChannelUserListeners: 'agora/setEchoChannelUserListeners',
        }),
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
