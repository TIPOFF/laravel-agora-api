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

        callIncoming: false,
        incomingCaller: null,

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
            console.log('Registering channel listeners...');
            state.echoChannel.here((users) => {
                console.log('Here event called.');
                console.log(users);
                console.log(state.activeUsers);
                state.activeUsers = users;
                console.log(state.activeUsers);
            });

            state.echoChannel.joining((user) => {
                console.log('User joining.');
                let usersIndex = state.activeUsers.findIndex((data) => {
                    data.id === user.id;
                });
console.log(usersIndex);
                if (usersIndex === -1) {
                    console.log('Adding user');
                    state.activeUsers.push(user);
                    console.log(state.activeUsers);
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
                    state.callIncoming = true;

                    state.agoraChannelName = data.agoraChannel;
                }
            });
        },
    },

    actions: {
        async makeCall(recipientId) {
            console.log('Hit!');
            console.log(recipientId);
            state.currentUser.name = 'Test!';
        },
    },

    getters: {}
}
