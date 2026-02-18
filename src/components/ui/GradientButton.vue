<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href ? target : undefined"
    :type="href ? undefined : type"
    :disabled="disabled"
    class="gradient-button"
    :class="buttonClasses"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'gold', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  href: {
    type: String,
    default: null
  },
  target: {
    type: String,
    default: '_self'
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const buttonClasses = computed(() => [
  `gradient-button--${props.variant}`,
  `gradient-button--${props.size}`,
  { 'gradient-button--disabled': props.disabled }
])
</script>

<style scoped>
.gradient-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gradient-button--sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
}

.gradient-button--md {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-base);
  border-radius: var(--radius-full);
}

.gradient-button--lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-full);
}

.gradient-button--primary {
  color: var(--color-text-inverse);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
}

.gradient-button--primary:hover:not(.gradient-button--disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.gradient-button--secondary {
  color: var(--color-text-inverse);
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
}

.gradient-button--secondary:hover:not(.gradient-button--disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.gradient-button--gold {
  color: var(--color-text);
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
}

.gradient-button--gold:hover:not(.gradient-button--disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.gradient-button--outline {
  color: var(--color-primary);
  background: transparent;
  border: 2px solid var(--color-primary);
}

.gradient-button--outline:hover:not(.gradient-button--disabled) {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.gradient-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>
