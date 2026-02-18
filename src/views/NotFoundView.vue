<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle">Standard Not Found</h2>
        <p class="not-found-text">
          The standard you're looking for doesn't exist or has been moved.
        </p>
        <div class="not-found-actions">
          <router-link to="/" class="btn btn-primary">
            Browse All Standards
          </router-link>
          <a href="/" class="btn btn-outline">
            Go to SIPM Home
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSeo } from '@/composables/useSeo.js'

useSeo({
  title: 'Page Not Found',
  description: 'The requested standard could not be found.',
  url: '/404'
})
</script>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) 0;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
}

.not-found-title {
  font-family: var(--font-serif);
  font-size: 8rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--spacing-md);
}

.not-found-subtitle {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.not-found-text {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.not-found-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.btn-primary {
  color: var(--color-text-inverse);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-outline {
  color: var(--color-primary);
  background: transparent;
  border: 2px solid var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

@media (max-width: 640px) {
  .not-found-title {
    font-size: 5rem;
  }

  .not-found-actions {
    flex-direction: column;
  }
}
</style>
