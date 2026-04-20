<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    class="flex items-center justify-center h-12 w-full font-bold transition-all"
    :class="[
      variant === 'secondary'
        ? 'bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-subtle'
        : 'bg-btn-primary-default text-on-dark hover:bg-btn-primary-hover active:bg-btn-primary-pressed',
    ]"
  >
    <slot />
  </button>
</template>
