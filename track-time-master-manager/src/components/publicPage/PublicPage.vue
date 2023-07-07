<script setup>
import { onMounted } from 'vue';


onMounted(()=>{
  document.title = "NDML - Página Inicial"
})
</script>

<template>
  <div class="container-fluid bg-dark text-white" style="padding-top: 5%; padding-bottom: 5%">
    <div class="container">
      <div class="d-flex justify-content-center">
        <div>
          <h3 class="display-6">Bem-vindo ao</h3>
          <h1 class="display-1"><b>Track Time Master Manager</b></h1>
        </div>
      </div>
    </div>
  </div>

  <!--div class="d-flex justify-content-center"-->
    <div class="container-fluid" style="padding-top: 5%; padding-bottom: 5%">
      <div class="container">
        <div class="d-flex flex-wrap justify-content-between">
          <button type="button" class="btn btn-dark btn-lg">Provas</button>
          <button type="button" class="btn btn-dark btn-lg">Calendários</button>
          <button type="button" class="btn btn-dark btn-lg">Organização</button>
          <button type="button" class="btn btn-dark btn-lg">Seguranças</button>
        </div>
      </div>
    </div>
  <!--/div-->
  
</template>
