import axios from 'axios';

export default {
    namespaced: true,

    state: () => ({
        currentUser: {
            id: null,
            name: null,
        },

        agoraClient: null,

        agoraRoutePrefix: '',

        connected: false,

        callIsIncoming: false,
        incomingCaller: null,
        callIsActive: false,

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

        initializeAgoraClient (state, agoraId) {
            state.agoraClient = AgoraRTC.createClient({
                mode: "rtc",
                codec: "h264"
            });

            state.agoraClient.init(
                agoraId,
                () => {
                    console.log("Successfully initialized AgoraRTC client.");
                },
                (err) => {
                    console.log("Failed to initialize AgoraRTC client.", err);
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

            state.echoChannel.listen("DispatchAgoraCall", ({ data }) => {
                if (parseInt(data.recipientId) === parseInt(state.currentUser.id)) {
                    let callerIndex = this.onlineUsers.findIndex((user) => {
                        user.id === data.senderId
                    });

                    state.incomingCaller = this.onlineUsers[callerIndex]["name"];
                    state.callIsIncoming = true;

                    state.agoraChannelName = data.agoraChannel;
                }
            });
        },
    },

    actions: {        
        async makeCall({commit, state}, {recipientId}) {
            try {
                // channelName = the caller's and the callee's id. you can use anything. tho.
                const channelName = `${state.currentUser.id}_to_${recipientId}`;
                const token = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                    channel_name: channelName,
                });

                // Broadcasts a call event to the callee and also gets back the token
                await axios.post("/"+ state.agoraRoutePrefix +"/place-call", {
                    channel_name: channelName,
                    recipient_id: recipientId,
                });

                // this.initializeAgora();
                // this.joinRoom(token.data, channelName);
            } catch (err) {
                console.log(err);
            }
        },
    },

    getters: {}
}
