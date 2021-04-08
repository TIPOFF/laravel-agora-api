<template>
    <div id="video-container">
        <div id="local-video" style="width: 100%;"></div>
        <div id="remote-video" style="width: 640px; height: 480px;"></div>

        <div class="agora-call-action-btns">
            <button v-if="callConnected && transmitAudio" class="agora-btn-toggle-audio" @click="muteAudio">
                Mute
            </button>
            <button v-else-if="callConnected && !transmitAudio" class="agora-btn-toggle-audio" @click="unmuteAudio">
                Unmute
            </button>

            <button v-if="callConnected && transmitVideo" class="agora-btn-toggle-video" @click="hideVideo">
                Hide Video
            </button>
            <button v-else-if="callConnected && !transmitVideo" class="agora-btn-toggle-video" @click="streamVideo">
                Show Video
            </button>

            <button v-if="callConnected" class="agora-btn-hang-up" @click="hangUp">
                Hang Up
            </button>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

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
        this.setAgoraAppID(this.agoraAppId);

        this.setEchoChannelName(this.echoChannelName);
        this.joinEchoChannel();

        this.setEchoChannelUserListeners();

        this.initializeAgoraClient();
    },

    methods: {
        ...mapMutations({
            setCurrentUser: 'agora/setCurrentUser',
            setAgoraAppID: 'agora/setAgoraAppID',
            setAgoraRoutePrefix: 'agora/setAgoraRoutePrefix',
            setEchoChannelName: 'agora/setEchoChannelName',
            joinEchoChannel: 'agora/joinEchoChannel',
        }),
        ...mapActions('agora', [
            'initializeAgoraClient',
            'initializeAudioAndVideoTracks',
            'setEchoChannelUserListeners',
            'muteAudio',
            'unmuteAudio',
            'hideVideo',
            'streamVideo',
            'hangUp',
        ]),
    },

    computed: {
        ...mapState('agora', [
            'callConnected',
            'transmitAudio',
            'transmitVideo',
        ]),
    },
}
</script>

<style scoped>

</style>
