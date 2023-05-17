<div class="divider">
    <div class="line"></div>
    <div class="content"> <slot/> </div>
    <div class="line"></div>
</div>


<style>

    .divider {
        display: flex;
        align-items: center;
        opacity: 0.8;
        padding: 8px 0;
    }

    .line {
        width: 100%;
        border-top: solid 1px var(--foreground-color);
    }

    .content {
        margin: 0 8px;
    }

</style>
