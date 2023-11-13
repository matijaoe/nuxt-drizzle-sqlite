<script lang="ts" setup>
const { data: users } = await useFetch('/api/users')
</script>

<template>
  <div>
    <h1 text-lg font-bold>
      Users
    </h1>

    <ul mt-8 flex flex-col gap-4>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} &bull; <NuxtLink :href="`mailto:${user.email}`" text-pink-500 underline>
          {{ user.email }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
