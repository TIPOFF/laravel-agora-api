import axios from 'axios';
import AgoraRTC from 'agora-rtc-sdk';

export default {
    namespaced: true,

    state: () => ({
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
        agoraChannel: null,
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
            state.agoraClient = AgoraRTC.createClient({
                mode: "rtc",
                codec: "h264"
            });

            state.agoraClient.init(
                state.agoraAppID,
                () => {
                    console.log("Successfully initialized AgoraRTC client.");
                },
                (err) => {
                    console.log("Failed to initialize AgoraRTC client.");
                    console.log(err);
                }
            );
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

            state.echoChannel.listen("Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall", ({ data }) => {
                console.log('Incoming call...');
                if (parseInt(data.recipientId) === parseInt(state.currentUser.id)) {
                    // let callerIndex = state.activeUsers.findIndex((user) => {
                    //     user.id === data.senderId
                    // });

                    // state.incomingCaller = state.activeUsers[callerIndex]["name"];
                    state.incomingCaller = data.senderDisplayName;
                    state.callIsIncoming = true;

                    state.agoraChannelName = data.agoraChannel;
                }
            });
        },
    },

    actions: {        
        async makeCall({commit, state, dispatch}, recipientId) {
            try {
                const channelName = `${state.currentUser.id}_to_${recipientId}`;
                const token = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                    channel_name: channelName,
                });

                // Broadcasts a call event to the callee and also gets back the token
                await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
                    channel_name: channelName,
                    recipient_id: recipientId,
                });

                commit('initializeAgoraClient');

                dispatch('joinRoom', {
                    token: token.data,
                    channel: channelName
                });
            } catch (err) {
                console.log(err);
            }
        },

        joinRoom({commit, state, dispatch}, {token, channel}) {
            console.log('Joining Agora room...');
            console.log(state);
            console.log(token);
            console.log(channel);
            state.agoraClient.join(
                token,
                channel,
                state.currentUser.name,
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
