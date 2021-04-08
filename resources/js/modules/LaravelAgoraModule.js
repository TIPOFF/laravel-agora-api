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
            state.rtc.client.on("user-unpublished", user => {
                // Get the dynamically created DIV container.
                const playerContainer = document.getElementById('remote-video');
                // Destroy the container.
                // playerContainer.remove();

                // Need to recreate it in case they make another call.
                //

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
                    state.callIsIncoming = true;

                    state.agoraChannelName = data.agoraChannel;

                    commit('setCallConnected', true);

                    let resp = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                        channel_name: state.agoraChannelName,
                    });

                    commit('setAgoraToken', resp.data.token);
            
                    dispatch('joinAgoraChannel');
                }
            });
        },

        async makeCall({commit, state, dispatch}, recipientId) {
            // state.rtc.client.setClientRole("host");

            state.agoraChannelName = `channel${state.currentUser.id}to${recipientId}`;

            let resp = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                channel_name: state.agoraChannelName,
            });

            commit('setAgoraToken', resp.data.token);

            // Broadcasts a call event to the callee.
            await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
                channel_name: state.agoraChannelName,
                recipient_id: recipientId,
            });
            
            dispatch('joinAgoraChannel');
        },

        async joinAgoraChannel({commit, state, dispatch}) {
            await state.rtc.client.join(
                state.agoraAppID,
                state.agoraChannelName,
                state.agoraToken,
                state.currentUser.id
            );

            [state.rtc.localAudioTrack, state.rtc.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            await state.rtc.client.publish([state.rtc.localAudioTrack, state.rtc.localVideoTrack]);

            commit('setTransmitAudio', true);
            commit('setTransmitVideo', true);

            commit('setCallConnected', true);
        },

        async hangUp({commit, state, dispatch}) {
            // Destroy the local audio and video tracks.
            state.rtc.localAudioTrack.close();
            state.rtc.localVideoTrack.close();

            // Traverse all remote users.
            // state.rtc.client.remoteUsers.forEach(user => {
            //     const playerContainer = document.getElementById('remote-video');
            //     playerContainer && playerContainer.remove();
            // });

            // Leave the channel.
            await state.rtc.client.leave();
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
