<script setup lang="ts">
const model = defineModel<string>()
defineProps<{
  label: string
  type?: string
  placeholder?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="text-text-primary text-sm font-normal leading-[140%]">{{ label }}</label>
    <div
      class="flex items-center gap-2 h-12 px-4 bg-bg-surface border-b border-border-default focus-within:border-border-focus transition-colors"
    >
      <input
        v-model="model"
        :type="type || 'text'"
        :placeholder="placeholder"
        class="flex-1 bg-transparent text-base text-text-primary placeholder-text-placeholder outline-none font-normal leading-[140%]"
      />
      <slot name="suffix" />
    </div>
  </div>
</template>
