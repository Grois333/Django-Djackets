<template>
    <div class="page-notfound">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">404 Page Not Found</h1>
                Go Back to<router-link to="/" class=""> Home</router-link>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'NotFound',
    mounted() {
        document.title = 'Not Found | Djackets';

    },
}
</script>


<style scoped>

    .page-notfound{
        text-align: center;
    }

</style>