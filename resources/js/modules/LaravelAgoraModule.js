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

        setAgoraRoutePrefix(state, prefix) {
            state.agoraRoutePrefix = prefix;
        },

        setEchoChannelName(state, name) {
            state.echoChannelName = name;
        },

        joinEchoChannel(state) {
            state.echoChannel = window.Echo.join(state.echoChannelName);
        },
    },

    actions: {
        async initializeAgoraClient (state) {
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
                    // Dynamically create a container in the form of a DIV element for playing the remote video track.
                    const playerContainer = document.createElement("div");
                    // Specify the ID of the DIV container. You can use the `uid` of the remote user.
                    playerContainer.id = user.uid.toString();
                    playerContainer.style.width = "640px";
                    playerContainer.style.height = "480px";
                    document.body.append(playerContainer);
                
                    // Play the remote video track.
                    // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
                    remoteVideoTrack.play(playerContainer);
                
                    // Or just pass the ID of the DIV container.
                    // remoteVideoTrack.play(playerContainer.id);
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
            rtc.client.on("user-unpublished", user => {
                // Get the dynamically created DIV container.
                const playerContainer = document.getElementById(user.uid);
                // Destroy the container.
                playerContainer.remove();
            });
        },

        async setEchoChannelUserListeners(state) {
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
                console.log('Incoming call...');
                console.log(data);
                if (parseInt(data.recipientId) === parseInt(state.currentUser.id)) {
                    console.log('Joining call...');
                    state.incomingCaller = data.senderDisplayName;
                    state.callIsIncoming = true;

                    state.agoraChannelName = data.agoraChannel;

                    // const token = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
                    //     channel_name: state.agoraChannelName,
                    // });

                    state.rtc.client.setClientRole("audience");

                    const uid = await state.rtc.client.join(
                        state.agoraAppID,
                        state.agoraChannelName,
                        token,
                        state.currentUser.id
                    );
            
                    dispatch('initializeAudioAndVideoTracks');
                }
            });
        },

        async initializeAudioAndVideoTracks ({commit, state, dispatch}) {
            [state.rtc.localAudioTrack, state.rtc.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            await state.rtc.client.publish([state.rtc.localAudioTrack, state.rtc.localVideoTrack]);

            console.log('Local audio and video published.');
        },

        async makeCall({commit, state, dispatch}, recipientId) {
            state.rtc.client.setClientRole("host");

            // const channelName = `channel${state.currentUser.id}to${recipientId}`;
            const channelName = 'some-great-channel';
//             const token = await axios.post("/"+ state.agoraRoutePrefix +"/retrieve-token", {
//                 channel_name: channelName,
//             });
// console.log(token);
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
        },

        async joinAgoraChannel({commit, state, dispatch}, {token, channel}) {

        },

        async leaveCall({commit, state, dispatch}) {

        },
    },

    getters: {}
}
