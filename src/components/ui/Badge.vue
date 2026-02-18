<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'error', 'info'].includes(value)
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge--default {
  background: var(--color-glass-dark);
  color: var(--color-text);
}

.badge--success {
  background: rgba(82, 183, 136, 0.2);
  color: #2d6a4f;
}

.badge--warning {
  background: rgba(244, 211, 94, 0.3);
  color: #a68520;
}

.badge--error {
  background: rgba(230, 57, 70, 0.2);
  color: #c9184a;
}

.badge--info {
  background: rgba(59, 126, 128, 0.2);
  color: var(--color-primary-dark);
}
</style>
