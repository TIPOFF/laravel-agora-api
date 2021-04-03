<template>
    <div class="agora-active-users-container">
        <h2 class="agora-active-users-title">Active Users</h2>
        <template v-for="user in activeUsers">
            <div v-bind:key="user.id" v-if="user.id !== currentUser.id" class="agora-active-user-details">
                {{ user.name }}
                <button @click="makeCall(user.id)" class="agora-btn agora-success-btn agora-call-user-button">Call</button>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: "AgoraUserList",

    computed: {
        ...mapState('agora', [
            'activeUsers',
            'currentUser',
        ]),
    },

    methods: {
        ...mapActions('agora', [
            'makeCall',
        ]),
    }
}
</script>

<style scoped>

</style>
