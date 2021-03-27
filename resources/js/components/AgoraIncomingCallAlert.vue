<template>
    <div class="incoming-call-alert" v-if="callIncoming">
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
        ...mapState([
            'agoraClient',
            'callIncoming',
            'incomingCaller',
        ]),
    },
}
</script>

<style scoped>

</style>
