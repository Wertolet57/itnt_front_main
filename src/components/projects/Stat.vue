<template>
    <div class="time-stats-container">
      <h3 class="title">Текущие вызовы от собеседников</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ stats.morning }}</div>
          <div class="stat-label">9:00 - 13:00</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.afternoon }}</div>
          <div class="stat-label">13:00 - 18:00</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.evening }}</div>
          <div class="stat-label">18:00 - 21:00</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.night }}</div>
          <div class="stat-label">21:00 - 9:00</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const stats = ref({
    morning: 12,
    afternoon: 2,
    evening: 2,
    night: 1
  });
  </script>
  
  <style scoped>
  .time-stats-container {
    font-family: Arial, sans-serif;
    /* max-width: 400px; */
    margin: 0 auto;
    padding: 20px;
    /* background-color: #f0f0f0; */
    border-radius: 10px;
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: normal;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-item {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    text-align: center;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
  }
  </style>