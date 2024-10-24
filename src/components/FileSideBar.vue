<template>
  <aside class="flex flex-col shrink-0 w-56 my-4 overflow-y-auto border-r-2">
    <div class="flex my-1 justify-center font-bold">
      File
    </div>
    <hr/>
    <!-- Save Tree -->
    <button
      :class="itemStyle('save-tree')"
      @click="store.fileSideView = 'save-tree'"
    >
      Save Tree
    </button>

    <button
      :class="itemStyle('load-tree')"
      @click="store.fileSideView = 'load-tree'"
    >
      Load Tree
    </button>

    <button
      :class="itemStyle('load-and-resolve-tree')"
      @click="store.fileSideView = 'load-and-resolve-tree'"
    >
      Load & Resolve Tree
    </button>
  </aside>
</template>

<script setup lang="ts">
import { FileSideView, useStore, useConfigStore } from "../store";


const store = useStore();

const itemStyle = (view: FileSideView) => {
  return (
    "side-bar-item " + (view === store.fileSideView ? "font-bold bg-blue-100" : "")
  );
};

</script>

<style scoped>
.side-bar-item {
  @apply block mx-2 my-[0.1875rem] px-4 py-2.5 rounded-3xl;
  @apply text-left text-[1.0625rem] select-none;
  @apply transition-colors hover:bg-blue-100;
}
</style>
