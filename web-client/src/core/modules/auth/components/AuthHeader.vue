<template>
    <header class="header">
        <div class="centered lockup">
            <div class="trident">
                <svg class="trident-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 48"
                    aria-describedby="iu-logo">
                    <title id="iu-logo">Indiana University Trident</title>
                    <rect width="41" height="48" fill="#900" />
                    <polygon
                        points="24.59 12.64 24.59 14.98 26.34 14.98 26.34 27.78 22.84 27.78 22.84 10.9 24.59 10.9 24.59 8.57 16.41 8.57 16.41 10.9 18.16 10.9 18.16 27.78 14.66 27.78 14.66 14.98 16.41 14.98 16.41 12.64 8.22 12.64 8.22 14.98 9.97 14.98 9.97 30.03 12.77 33.02 18.16 33.02 18.16 36.52 16.41 36.52 16.41 39.43 24.59 39.43 24.59 36.52 22.84 36.52 22.84 33.02 28 33.02 31.01 30.03 31.01 14.98 32.78 14.98 32.78 12.64 24.59 12.64"
                        fill="#fff" />
                </svg>
            </div>
            <p class="lockup-iu">
                Indiana University
            </p>
            <h1 class="lockup-title">
                Login
            </h1>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    height: auto;
    position: relative;
    background-color: #eaeaea;
}

.lockup-iu {
    display: none;
    font-size: 0.875rem;
    text-transform: uppercase;
    margin: 0;
    padding-left: 0.5rem;
    position: absolute;
    left: 50px;
}

.lockup-title {
    position: absolute;
    top: 19px;
    left: 57px;
    font-size: 1.4375rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .04rem;
    display: inline-block;
}

.trident {
    margin: 1rem;
    width: 32px;
    -ms-flex-preferred-size: 32px;
    flex-basis: 32px;
    height: 37px;
    background-color: inherit;
    color: inherit;
}

/* Small view ports and up */
@media screen and (min-width: 30em) {

    html,
    body {
        background-color: #eaeaea;
        height: auto;
    }

    .centered {
        margin: auto;
        max-width: 440px;
        width: 100%;
        position: inherit;
    }

    .lockup {
        overflow: hidden;
        margin-top: 2rem;
        bottom: -2rem;
        height: initial;
        padding-bottom: 1rem;
    }

    .lockup img {
        margin: 0;
        width: 50px;
    }

    .lockup-iu {
        display: inline-block;
        position: absolute;
        top: 4px;
        left: 67px;
    }

    .lockup-title {
        top: 22px;
        left: 75px;
        font-size: 1.625rem;
    }

    .trident {
        min-width: 58px;
        -ms-flex-preferred-size: 58px;
        flex-basis: 58px;
        height: 58px;
        margin: -1rem 0 2.5rem 1rem;
    }

    .trident-logo {
        width: 50px;
        height: 58px;
    }

    .tab[aria-selected='true'],
    .tab:hover,
    .tab:active,
    .content section {
        box-shadow: 0 .25rem 1rem rgba(0, 0, 0, 0.09);
    }

    .centered {
        max-width: 27.5rem;
        margin: 1rem auto;
    }

    .centered.lockup {
        max-width: 29.5rem;
        height: 0;
        min-height: 5.125rem;
        padding: 1rem 0;
    }

    .centered.lockup.external {
        min-height: 8.5625rem;
    }

    .third {
        padding: 0 0.75rem;
    }

    .base-title {
        font-size: 1.4375rem;
    }
}

/* Tab width for small mobile devices */
@media only screen and (max-width: 22rem) {
    .base {
        padding: 2rem 2rem 2.5rem;
    }

    .tab {
        padding-left: .5rem;
        padding-right: .5rem;
    }
}

/* Applied top margin for screens with vertical space */
@media only screen and (min-height: 54rem) and (min-width: 30em) {
    .header {
        margin-top: 2rem;
    }
}
</style>