<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand">
          <a href="/" class="footer-logo">
            <img src="@/assets/images/sipm-logo.svg" alt="SIPM Logo" class="footer-logo-img" />
            <div class="footer-logo-text">
              <span class="footer-logo-name">SIPM</span>
              <span class="footer-logo-full">International Society of Phytomedicine</span>
            </div>
          </a>
          <p class="footer-tagline">
            Developing international standards for phytomedicine through
            scientific rigor and global collaboration.
          </p>
        </div>

        <!-- Standards Column -->
        <div class="footer-nav">
          <h4 class="footer-heading">Standards</h4>
          <ul class="footer-links">
            <li><router-link to="/foundation">Foundation</router-link></li>
            <li><router-link to="/quality">Quality</router-link></li>
            <li><router-link to="/science">Science</router-link></li>
            <li><router-link to="/governance">Governance</router-link></li>
          </ul>
        </div>

        <!-- SIPM Links Column -->
        <div class="footer-nav">
          <h4 class="footer-heading">SIPM</h4>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about/mission">About</a></li>
            <li><a href="/members/benefits">Membership</a></li>
            <li><a href="/herbapedia/">Herbapedia</a></li>
          </ul>
        </div>

        <!-- External Links -->
        <div class="footer-nav">
          <h4 class="footer-heading">Resources</h4>
          <ul class="footer-links">
            <li><a href="https://github.com/sipmorg/standards" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="mailto:info@sipm.org">Contact</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          © {{ currentYear }} International Society of Phytomedicine. All rights reserved.
        </p>
        <div class="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--color-primary-dark);
  color: var(--color-text-inverse);
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  margin-bottom: var(--spacing-md);
}

.footer-logo-img {
  width: 48px;
  height: 48px;
}

.footer-logo-text {
  display: flex;
  flex-direction: column;
}

.footer-logo-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-inverse);
  line-height: 1.2;
}

.footer-logo-full {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.7);
}

.footer-tagline {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.footer-heading {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-md);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-copyright {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: var(--spacing-lg);
}

.footer-legal a {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-legal a:hover {
  color: var(--color-accent);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
  }

  .footer-brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-logo {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}
</style>
