<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
import { log } from 'util';
export default {
  name: 'App',
  created () {
    // console.log("created!")
  }
}
</script>
