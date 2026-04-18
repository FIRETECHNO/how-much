<script setup lang="ts">
defineProps<{
  items: string[]
  color: 'manager' | 'employer' | 'employee'
}>()
</script>

<template>
  <v-row class="advantages-mobile mx-0">
    <v-col v-for="(text, index) in items" :key="index" cols="12" class="pa-0 pb-3">
      <v-sheet
        rounded="xl"
        elevation="0"
        class="advantage-card pa-4"
        :class="`advantage-card--${color}`"
      >
        <div class="d-flex align-start ga-3">
          <span class="advantage-index flex-shrink-0" :class="`advantage-index--${color}`">
            {{ index + 1 }}
          </span>
          <p class="advantage-text text-body-1 mb-0">
            {{ text }}
          </p>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.advantage-text {
  line-height: 1.5;
  white-space: pre-line;
  color: rgb(var(--v-theme-on-surface));
}

.advantage-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  color: white;
}

@each $role in manager, employer, employee {
  .advantage-card--#{$role} {
    border-left: 4px solid rgb(var(--v-theme-#{$role}));
    background: rgba(var(--v-theme-#{$role}), 0.1);
  }

  .advantage-index--#{$role} {
    background: rgb(var(--v-theme-#{$role}));
  }
}
</style>
