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
    }),

    mutations: {
        setCurrentUser (state, user) {
            state.currentUser.id = parseInt(user.id);
            state.currentUser.name = user.name;
        },

        setAgoraAppID (state, id) {
            state.agoraAppID = id;
        },

        initializeAgoraClient (state) {
            state.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            // state.agoraClient = AgoraRTC.createClient({
            //     mode: "rtc",
            //     codec: "h264"
            // });

            // state.agoraClient.init(
            //     state.agoraAppID,
            //     () => {
            //         console.log("Successfully initialized AgoraRTC client.");
            //     },
            //     (err) => {
            //         console.log("Failed to initialize AgoraRTC client.");
            //         console.log(err);
            //     }
            // );
        },

        setAgoraRoutePrefix(state, prefix) {
            state.agoraRoutePrefix = prefix;
        },

        setEchoChannelName(state, name) {
            state.echoChannelName = name;
        },

        joinEchoChannel(state) {
            state.echoChannel = window.Echo.join(state.echoChannelName);
        },

        setEchoChannelUserListeners(state) {
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

            state.echoChannel.listen(".Tipoff\\LaravelAgoraApi\\Events\\DispatchAgoraCall", (data) => {
                console.log('Incoming call...');
                console.log(data);
                if (parseInt(data.recipientId) === parseInt(state.currentUser.id)) {
                    console.log('Joining call...');
                    state.incomingCaller = data.senderDisplayName;
                    state.callIsIncoming = true;

                    state.agoraChannelName = data.agoraChannel;
                }
            });
        },
    },

    actions: {  
        async initializeAudioAndVideoTracks ({commit, state, dispatch}) {
            // state.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // state.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            [state.rtc.localAudioTrack, state.rtc.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            // I may have to assign the tracks to temp vars and then use mutations to assign them to state.
            // Mute and unmute mutations?
            // Or maybe this should all just be in a method on the component.

            await state.rtc.client.publish([state.rtc.localAudioTrack, state.rtc.localVideoTrack]);

            console.log('Local audio and video published.');
        },

        async makeCall({commit, state, dispatch}, recipientId) {
            // const channelName = `channel${state.currentUser.id}to${recipientId}`;
            const channelName = 'some-great-channel';
            const token = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                channel_name: channelName,
            });

            // Broadcasts a call event to the callee.
            await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
                channel_name: channelName,
                recipient_id: recipientId,
            });
            
            const uid = await state.rtc.client.join(
                state.agoraAppID,
                channelName,
                token,
                state.currentUser.id
            );
            
            dispatch('initializeAudioAndVideoTracks');

            // try {
            //     const channelName = `channel${state.currentUser.id}to${recipientId}`;
            //     const token = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
            //         channel_name: channelName,
            //     });

            //     // Broadcasts a call event to the callee and also gets back the token
            //     await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
            //         channel_name: channelName,
            //         recipient_id: recipientId,
            //     });

            //     commit('initializeAgoraClient');

            //     dispatch('joinRoom', {
            //         token: token.data,
            //         channel: channelName
            //     });
            // } catch (err) {
            //     console.log(err);
            // }
        },

        joinRoom({commit, state, dispatch}, {token, channel}) {
            console.log('Joining Agora room...');
            console.log(token);
            console.log(channel);
            state.agoraClient.join(
                token,
                channel,
                state.currentUser.id,
                (uid) => {
                    console.log(`User ${uid} joined Agora channel successfully.`);
                    state.callConnected = true;

                    // commit('createLocalStream');
                    // commit('initializeAgoraListeners');
                },
                (err) => {
                    console.log("Failed to join channel.");
                    console.log(err);
                }
            );
        },
    },

    getters: {}
}
