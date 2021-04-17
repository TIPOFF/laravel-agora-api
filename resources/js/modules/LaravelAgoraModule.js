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

        callOutgoing: false,

        callIsIncoming: false,
        incomingCaller: null,
        incomingCallerId: null,
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

        setActiveUsers(state, users) {
            state.activeUsers = users;
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

        setIncomingCaller(state, caller) {
            state.incomingCaller = caller;
        },

        setIncomingCallerId(state, id) {
            state.incomingCallerId = id;
        },

        setCallOutgoing(state, newState) {
            state.callOutgoing = newState;
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
                commit('setActiveUsers', users);
            });

            state.echoChannel.joining((user) => {
                let newActiveUsers = state.activeUsers.slice();

                let usersIndex = newActiveUsers.findIndex((data) => {
                    data.id === user.id;
                });

                if (usersIndex === -1) {
                    newActiveUsers.push(user);
                    commit('setActiveUsers', newActiveUsers);
                }
            });

            state.echoChannel.leaving((user) => {
                let newActiveUsers = state.activeUsers.slice();

                let usersIndex = newActiveUsers.findIndex((data) => {
                    data.id === user.id;
                });

                newActiveUsers.splice(usersIndex, 1);

                commit('setActiveUsers', newActiveUsers);
            });

            state.echoChannel.listen(".Tipoff\\LaravelAgoraApi\\Events\\DispatchAgoraCall", async (data) => {
                if (parseInt(data.recipientId) === parseInt(state.currentUser.id)) {
                    commit('setIncomingCaller', data.senderDisplayName);
                    commit('setIncomingCallerId', data.senderId);
                    commit('setCallIsIncoming', true);

                    // TODO: If they do not respond within a certain amount of time,
                    // auto-reject the call. (Including dispatching the rejected/not
                    // answered event.) await dispatch('rejectIncomingCall');

                    // TODO: If they do accept the call, hang up on any other calls that they are
                    // involved in first before connecting to the incoming one.
                    
                    commit('setAgoraChannel', data.agoraChannel);
                }
            })
            .listen(".Tipoff\\LaravelAgoraApi\\Events\\RejectAgoraCall", async (data) => {
                if (parseInt(data.callerId) === parseInt(state.currentUser.id)) {
                    console.log("Call rejected.");
                    
                    await dispatch('leaveAgoraChannel');
                    commit('setAgoraChannel', '');
                    commit('setCallOutgoing', false);
                    commit('setCallConnected', false);
                }
            })
            .listen(".Tipoff\\LaravelAgoraApi\\Events\\AgoraCallAccepted", async (data) => {
                if (parseInt(data.callerId) === parseInt(state.currentUser.id)) {
                    console.log("Call accepted.");

                    commit('setCallOutgoing', false);
                    commit('setCallConnected', true);

                    // Do the actual joining of the Agora channel here, after
                    // the call has been accepted.
                    dispatch('joinAgoraChannel');
                }
            });
        },

        async makeCall({commit, state, dispatch}, recipientId) {
            // state.rtc.client.setClientRole("host");
            commit('setCallOutgoing', true);

            commit('setAgoraChannel', 'ac' + Math.floor(Math.random() * (99999999999 - 1111111111 + 1)) + 1111111111);

            await dispatch('fetchAgoraToken');

            // Broadcasts a call event to the callee.
            await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
                channel_name: state.agoraChannelName,
                recipient_id: recipientId,
            });
        },

        async acceptCall({commit, state, dispatch}) {
            commit('setCallIsIncoming', false);
            commit('setCallConnected', true);

            // Send acceptance event.
            await axios.post("/"+ state.agoraRoutePrefix +"/accept-call", {
                caller_id: state.incomingCallerId,
                recipient_id: state.currentUser.id,
            });

            await dispatch('fetchAgoraToken');
            await dispatch('joinAgoraChannel');
        },

        async rejectCall({commit, state, dispatch}) {
            commit('setIncomingCaller', null);
            commit('setCallIsIncoming', false);
            commit('setAgoraChannel', '');

            // Send rejection event.
            await axios.post("/"+ state.agoraRoutePrefix +"/reject-call", {
                caller_id: state.incomingCallerId,
                recipient_id: state.currentUser.id,
            });

            commit('setIncomingCallerId', null);
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

        async leaveAgoraChannel({commit, state}) {
            // Destroy the local audio and video tracks.
            if (state.rtc.localAudioTrack !== null) {
                state.rtc.localAudioTrack.close();
                commit('setLocalAudioTrack', null);
            }
            
            if (state.rtc.localVideoTrack !== null) {
                state.rtc.localVideoTrack.close();
                commit('setLocalVideoTrack', null);
            }

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
