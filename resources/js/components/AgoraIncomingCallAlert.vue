<template>
    <div class="incoming-call-alert" v-if="callIsIncoming">
        <div>
            <p>Incoming call from: {{ incomingCaller }}</p>

            <div class="btn-group" role="group">
                <button class="agora-btn agora-btn-success agora-btn-accept" @click="acceptCall">
                    Accept
                </button>

                <button class="agora-btn agora-btn-danger agora-btn-decline" @click="rejectCall">
                    Decline
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: "AgoraIncomingCallAlert",

    computed: {
        ...mapState('agora', [
            'callIsIncoming',
            'incomingCaller',
        ]),
    },

    methods: {
        ...mapActions('agora', [
            'acceptCall',
            'rejectCall',
        ]),
    }
}
</script>

<style scoped>

</style>
