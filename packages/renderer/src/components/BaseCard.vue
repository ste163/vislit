<template>
  <div class="card">
    <header>
      <h1>
        <slot name="header" />
      </h1>
    </header>

    <div>
      <slot>
        <!-- Should be BaseCardContent components -->
      </slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: white;
  padding: 1em 2em 1.5em 2em;
  border-radius: 0.35em;
  width: clamp(370px, 50vw, 500px);
}
</style>
