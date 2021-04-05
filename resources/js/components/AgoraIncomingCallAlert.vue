<template>
    <div class="incoming-call-alert" v-if="callIsIncoming">
        <div>
            <p>Incoming call from: {{ incomingCaller }}</p>

            <div class="btn-group" role="group">
                <button class="agora-btn-accept" @click="acceptCall">
                    Accept
                </button>

                <button class="agora-btn-decline" @click="declineCall">
                    Decline
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "AgoraIncomingCallAlert",

    computed: {
        ...mapState('agora', [
            'callIsIncoming',
            'incomingCaller',
        ]),
    },

    methods: {
        acceptCall: function() {
            console.log('Call accepted.');
        },
        
        declineCall: function() {
            console.log('Call declined.');
        }
    }
}
</script>

<style scoped>

</style>
