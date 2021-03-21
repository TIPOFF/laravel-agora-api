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
export default {
    name: "AgoraIncomingCallAlert",
}
</script>

<style scoped>

</style>
