<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-success">
      <div class="container">
        <RouterLink to="/" class="navbar-brand">AINO</RouterLink>
        <div class="navbar-nav mr-auto">
          <li class="nav-item">
            <RouterLink to="/Status" class="nav-link">Status</RouterLink>
          </li>
        </div>
      </div>
    </nav>
    <div class="container mt-3">
      <RouterView />
    </div>
  </div>
</template>
