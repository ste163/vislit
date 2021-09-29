<template>
  <section class="content-container">
    <header class="content-header">
      <div class="notification-container">
        <slot name="notification-dot"></slot>
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
  position: relative;
}

.content-header {
  display: flex;
  align-items: center;
}

.notification-container {
  position: absolute;
  left: -20px;
}

.button-container {
  display: flex;
  margin-top: 0.5em;
}
</style>
