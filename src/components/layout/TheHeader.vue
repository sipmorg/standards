<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-container container">
      <!-- Logo - Links to main site -->
      <a href="/" class="header-logo">
        <img src="@/assets/images/sipm-logo.svg" alt="SIPM Logo" class="logo-img" />
        <div class="logo-text">
          <span class="logo-name">SIPM</span>
          <span class="logo-full">Standards</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="header-nav" :class="{ 'nav-open': mobileNavOpen }">
        <router-link to="/foundation" class="nav-link" @click="closeMobileNav">Foundation</router-link>
        <router-link to="/quality" class="nav-link" @click="closeMobileNav">Quality</router-link>
        <router-link to="/science" class="nav-link" @click="closeMobileNav">Science</router-link>
        <router-link to="/governance" class="nav-link" @click="closeMobileNav">Governance</router-link>

        <!-- Cross-site links -->
        <a href="/" class="nav-link nav-link--external" @click="closeMobileNav">SIPM Home</a>
        <a href="/herbapedia/" class="nav-link nav-link--external" @click="closeMobileNav">Herbapedia</a>
      </nav>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-toggle" @click="toggleMobileNav" :aria-expanded="mobileNavOpen">
        <span class="hamburger" :class="{ 'hamburger-open': mobileNavOpen }"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const mobileNavOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 100;
  transition: all var(--transition-normal);
}

.header-scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-md);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
}

.logo-img {
  width: 48px;
  height: 48px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1.2;
}

.logo-full {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  letter-spacing: 0.02em;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  text-decoration: none;
  padding: var(--spacing-sm) 0;
  position: relative;
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width var(--transition-fast);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link--external {
  opacity: 0.8;
}

.nav-link--external:hover {
  opacity: 1;
}

.mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  position: relative;
  transition: all var(--transition-fast);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-text);
  transition: all var(--transition-fast);
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger-open {
  background: transparent;
}

.hamburger-open::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger-open::after {
  bottom: 0;
  transform: rotate(-45deg);
}

@media (max-width: 1024px) {
  .mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: stretch;
    padding: var(--spacing-xl);
    gap: 0;
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  }

  .nav-open {
    transform: translateX(0);
  }

  .nav-link {
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--color-border);
  }
}

@media (max-width: 640px) {
  .logo-full {
    display: none;
  }
}
</style>
