<template>
    <footer class="footer" role="contentinfo">
        <p><a href="https://www.iu.edu/copyright/index.html" target="_blank">Copyright</a> &copy; {{ footerYear }} The
            Trustees of <a href="http://www.iu.edu/" target="_blank">Indiana
                University</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="../../../../privacy_iulogin.html" target="_blank">Privacy
                Policy</a>.
        </p>
    </footer>
</template>

<script setup>
const footerYear = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.footer {
    flex-shrink: 0;
    text-align: center;
    font-size: 0.75rem;
    padding-left: 2rem;
    padding-right: 2rem;
}

.footer a {
    color: #333;
}

@media screen and (min-width: 30em) {
    .footer {
        margin-bottom: 4rem;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
    }
}
</style>