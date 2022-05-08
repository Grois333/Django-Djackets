<template>
    <div class="page-success">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Thank you</h1>

                <p>Your order will be processed within 48 hours</p>

                <router-link to="/my-account" class="">View My Orders</router-link>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Success',
    mounted() {
        document.title = 'Success | Djackets';

         if (localStorage.getItem('reloaded')) {
        // The page was just reloaded. Clear the value from local storage
        // so that it will reload the next time this page is visited.
            localStorage.removeItem('reloaded');
        } else {
            // Set a flag so that we know not to reload the page twice.
            this.$store.commit('clearCart');
            localStorage.setItem('reloaded', '1');
            location.reload();
        }
    },
}
</script>