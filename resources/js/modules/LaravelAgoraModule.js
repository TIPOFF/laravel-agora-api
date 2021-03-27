export default {
    namespaced: true,

    state: () => ({
        agoraClient: null,

        connected: false,
        callIncoming: false,

        transmitAudio: false,
        transmitVideo: false,

        incomingCaller: null,

        activeUsers: [],
    }),

    mutations: {
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
    },

    actions: {},

    getters: {}
}
