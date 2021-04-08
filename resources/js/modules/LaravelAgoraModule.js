import axios from 'axios';
import AgoraRTC from "agora-rtc-sdk-ng"

export default {
    namespaced: true,

    state: () => ({
        rtc: {
            client: null,
            localAudioTrack: null,
            localVideoTrack: null,
        },

        currentUser: {
            id: null,
            name: null,
        },

        agoraClient: null,

        agoraRoutePrefix: '',
        agoraAppID: null,

        callIsIncoming: false,
        incomingCaller: null,
        callConnected: false,

        stream: null,

        transmitAudio: false,
        transmitVideo: false,

        activeUsers: [],

        echoChannelName: '',
        echoChannel: null,

        agoraChannelName: '',
        agoraToken: '',
    }),

    mutations: {
        setCurrentUser (state, user) {
            state.currentUser.id = parseInt(user.id);
            state.currentUser.name = user.name;
        },

        setAgoraAppID (state, id) {
            state.agoraAppID = id;
        },

        setAgoraRoutePrefix(state, prefix) {
            state.agoraRoutePrefix = prefix;
        },

        setAgoraChannel(state, name) {
            state.agoraChannelName = name;
        },

        setAgoraToken(state, token) {
            state.agoraToken = token;
        },

        setEchoChannelName(state, name) {
            state.echoChannelName = name;
        },

        joinEchoChannel(state) {
            state.echoChannel = window.Echo.join(state.echoChannelName);
        },

        setTransmitAudio(state, newState) {
            state.transmitAudio = newState;
        },

        setTransmitVideo(state, newState) {
            state.transmitVideo = newState;
        },

        setLocalAudioTrack(state, audioTrack) {
            state.rtc.localAudioTrack = audioTrack;
        },

        setLocalVideoTrack(state, videoTrack) {
            state.rtc.localVideoTrack = videoTrack;
        },

        setCallIsIncoming(state, newState) {
            state.callIsIncoming = newState;
        },

        setCallConnected(state, newState) {
            state.callConnected = newState;
        },
    },

    actions: {
        async initializeAgoraClient ({commit, state, dispatch}) {
            state.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

            // Listen for people joining the call.
            state.rtc.client.on("user-published", async (user, mediaType) => {
                // Subscribe to a remote user.
                await state.rtc.client.subscribe(user, mediaType);
                console.log("subscribe success");
                
                // If the subscribed track is video.
                if (mediaType === "video") {
                    // Get `RemoteVideoTrack` in the `user` object.
                    const remoteVideoTrack = user.videoTrack;

                    remoteVideoTrack.play('remote-video');
                }
                
                // If the subscribed track is audio.
                if (mediaType === "audio") {
                    // Get `RemoteAudioTrack` in the `user` object.
                    const remoteAudioTrack = user.audioTrack;
                    // Play the audio track. No need to pass any DOM element.
                    remoteAudioTrack.play();
                }
            });

            // Listen for users leaving the call.
            state.rtc.client.on("user-left", async user => {
                await dispatch('leaveAgoraChannel');

                commit('setCallConnected', false);
            });
        },

        async setEchoChannelUserListeners({commit, state, dispatch}) {
            state.echoChannel.here((users) => {
                state.activeUsers = users;
            });

            state.echoChannel.joining((user) => {
                let usersIndex = state.activeUsers.findIndex((data) => {
                    data.id === user.id;
                });

                if (usersIndex === -1) {
                    state.activeUsers.push(user);
                }
            });

            state.echoChannel.leaving((user) => {
                let usersIndex = state.activeUsers.findIndex((data) => {
                    data.id === user.id;
                });

                state.activeUsers.splice(usersIndex, 1);
            });

            state.echoChannel.listen(".Tipoff\\LaravelAgoraApi\\Events\\DispatchAgoraCall", async (data) => {
                if (parseInt(data.recipientId) === parseInt(state.currentUser.id)) {
                    state.incomingCaller = data.senderDisplayName;
                    commit('setCallIsIncoming', true);

                    // The break in flow starts here. Just set things to an "incoming"
                    // status (including the incoming channel) and only proceed to 
                    // connect if they click on the button.
                    // ALSO, if they do not respond within a certain amount of time,
                    // auto-reject the call. (Including dispatching the rejected/not
                    // answered event.)

                    // If they do accept the call, hang up on any other calls that they are
                    // involved in first before connecting to the incoming one.
                    
                    commit('setAgoraChannel', data.agoraChannel);

                    commit('setCallConnected', true);

                    await dispatch('fetchAgoraToken');
            
                    await dispatch('joinAgoraChannel');
                }
            });
        },

        async makeCall({commit, state, dispatch}, recipientId) {
            // state.rtc.client.setClientRole("host");

            commit('setAgoraChannel', `channel${state.currentUser.id}to${recipientId}`);

            await dispatch('fetchAgoraToken');

            // Broadcasts a call event to the callee.
            await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
                channel_name: state.agoraChannelName,
                recipient_id: recipientId,
            });
            
            dispatch('joinAgoraChannel');
        },

        async fetchAgoraToken({commit, state}) {
            let resp = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                channel_name: state.agoraChannelName,
            });

            commit('setAgoraToken', resp.data.token);
        },

        async joinAgoraChannel({commit, state}) {
            await state.rtc.client.join(
                state.agoraAppID,
                state.agoraChannelName,
                state.agoraToken,
                state.currentUser.id
            );

            let [localAudio, localVideo] = await AgoraRTC.createMicrophoneAndCameraTracks();

            commit('setLocalAudioTrack', localAudio);
            commit('setLocalVideoTrack', localVideo);

            await state.rtc.client.publish([state.rtc.localAudioTrack, state.rtc.localVideoTrack]);

            commit('setTransmitAudio', true);
            commit('setTransmitVideo', true);

            commit('setCallIsIncoming', false);
            commit('setCallConnected', true);
        },

        async leaveAgoraChannel({state}) {
            // Destroy the local audio and video tracks.
            state.rtc.localAudioTrack.close();
            state.rtc.localVideoTrack.close();

            await state.rtc.client.leave();
        },

        async hangUp({commit, state, dispatch}) {
            await dispatch('leaveAgoraChannel');

            commit('setCallConnected', false);
        },

        async muteAudio({commit, state}) {
            await state.rtc.localAudioTrack.setEnabled(false);
            commit('setTransmitAudio', false);
        },

        async unmuteAudio({commit, state}) {
            await state.rtc.localAudioTrack.setEnabled(true);
            commit('setTransmitAudio', true);
        },

        async hideVideo({commit, state}) {
            await state.rtc.localVideoTrack.setEnabled(false);
            commit('setTransmitVideo', false);
        },

        async streamVideo({commit, state}) {
            await state.rtc.localVideoTrack.setEnabled(true);
            commit('setTransmitVideo', true);
        },
    },

    getters: {}
}
