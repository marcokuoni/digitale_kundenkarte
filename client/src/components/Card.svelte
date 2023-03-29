<div class="card">
    <!--<p class="subtitle">THE CROWN BAR</p>-->
    <h1 class="title">Ehrenkarte</h1>
    <div class="stamp-wrapper">
        <Stamp status/>
        <Stamp status/>
        <Stamp status/>
        <Stamp status/>
        <Stamp/>
        <Stamp/>
        <Stamp/>
        <Stamp/>
        <div class="surprise-wrapper">
            <img src="/images/surprise-arrow.svg" class="surprise-arrow" alt="an arrow pointing left">
            <p>Ehrenhafte<br>Überraschung</p>
        </div>
    </div>
</div>


<script lang="ts">
    import Stamp from './Stamp.svelte'
</script>

<style>


    .card {
        /*width: 100%;*/
        max-width: 400px;
        padding: 16px 24px;
        background-color: #000000;
        box-shadow: 0 0 33px 0 rgba(255, 91, 80, 0.33);
        border-radius: 4px;
    }

    .title {
        font-family: "Tiempos Fine", serif;
        font-size: 26pt;
        padding-bottom: 4px;
    }

    .subtitle {
        font-size: 8pt;
        line-height: 8pt;
        font-weight: bold;
    }

    .stamp-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    .surprise-wrapper {
        display: flex;
        align-items: center;
        width: 30%;
        aspect-ratio: 2;
        padding-bottom: 3%;

        color: var(--secondary-color);
        font-size: 8px;
    }

    .surprise-arrow {
        margin-right: 4px;
    }



</style>