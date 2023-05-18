<div>
  <div class="loader" />
</div>

<style>
  .loader {
    position: absolute;
    top: 0;
    background-color: var(--accent-color);
    width: 100vw;
    height: 5px;
    animation: fill 2s ease-in-out infinite;
  }

  @keyframes fill { 
    0% {
      -webkit-transform: scaleX(0);
    }
    50% {
      transform: scaleX(1);
    }
    100% {
      transform: scaleX(0);
    }
  }
</style>
