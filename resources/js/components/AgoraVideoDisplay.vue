<template>
    <div id="video-container">
        <div id="local-video" style="width: 100%;"></div>
        <div id="remote-video" style="width: 640px; height: 480px;"></div>

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
            'hangUp',
        ]),

        toggleAudio: function() {
            console.log('clicked!');
        },

        toggleVideo: function() {
            console.log('clicked!');
        },
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
