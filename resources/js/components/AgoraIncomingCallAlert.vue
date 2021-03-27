<template>
    <div class="incoming-call-alert" v-if="callIncoming">
        <div>
            <p>Incoming call from: {{ incomingCaller }}</p>

            <div class="btn-group" role="group">
                <button @click="acceptCall">
                    Accept
                </button>

                <button @click="declineCall">
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

    computed: mapState([
        'callIncoming'
    ]),
}
</script>

<style scoped>

</style>
