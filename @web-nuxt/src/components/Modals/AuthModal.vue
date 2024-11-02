<script setup>
const model = defineModel();
</script>

<template>
  <Modal v-model="model">
    <Modals.AuthModalContent />
  </Modal>
</template>
