<template>
  <section class="content-container">
    <header>
      <div>
        <!-- Optional notification dot -->
      </div>
      <h2>
        <slot name="header"></slot>
      </h2>
    </header>

    <p>
      <slot></slot>
    </p>

    <div class="button-container">
      <slot name="buttons"></slot>
    </div>
  </section>
</template>

<style scoped>
.content-container {
  margin: 1em 0em;
}

.button-container {
  display: flex;
  margin-top: 0.5em;
}
</style>
