<template>
    <div class="outgoing-call-alert" v-if="callOutgoing">
        <p>Call in progress...</p>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "AgoraCallOutgoingAlert",

    computed: {
        ...mapState('agora', [
            'callOutgoing',
        ]),
    },
}
</script>

<style scoped>

</style>
