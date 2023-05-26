<script>
  import { Link } from 'svelte-routing';

  export let to = '';
  export let classes = [];

  function getProps({ href, isPartiallyCurrent, isCurrent }) {
    const isActive = href === '/' ? isCurrent : isPartiallyCurrent || isCurrent;

    // The object returned here is spread on the anchor element's attributes
    if (isActive) {
      return { class: 'active' };
    }
    return {};
  }
</script>

<div class="default-button {classes.join(' ')}">
  <Link {to} {getProps}>
    <slot />
  </Link>
</div>
