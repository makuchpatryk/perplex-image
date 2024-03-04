<script setup lang="ts"></script>

<template>
  <Game
    :number="$route.params.id && $route.params.id[0]"
    :level="$route.query.level"
    :widthGame="Number($route.query.width)"
  />
</template>
