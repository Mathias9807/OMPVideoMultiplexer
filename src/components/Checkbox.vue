<script lang="ts" setup>

  const props = defineProps<{
		label: string,
  }>();

  const value = defineModel<boolean>({ required: true });
</script>

<template>
  <div class="container">
	<input type="checkbox" :id="props.label" v-model="value" />
	<label :for="props.label">{{ props.label }}</label>
  </div>
</template>

<style scoped>
  .container {
		display: flex;
		font-size: 1rem;
		justify-content: center;
		align-items: center;
		margin: 1rem 0.25rem;
		color: white;
  }

	.container * {
		cursor: pointer;
	}

  input[type="checkbox"] {
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 1rem;
		background: #3a2f52;
		border: none;
		border-radius: 5px;
  }

  input[type="checkbox"]:checked {
		background: #ae9ad9;
		background-size: cover;
		border: solid;
		border-color: #3a2f52;
		border-width: 5px;
  }
</style>