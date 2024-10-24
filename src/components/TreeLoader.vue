<template>
  <div>
    <!-- Hidden file input -->
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      accept=".pfs"
      style="display: none;"
    />

    <!-- Custom button -->

    <button class="button-base button-blue" @click="promptUserAndLoadTree">
      Load Tree
    </button>
  </div>
  <div>
   <p v-if="error" style="color: red;">Error: {{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from "../store";
import { dialog } from '@tauri-apps/api';
import * as invokes from "../invokes";

// We need the store for loading trees.
const store = useStore();
const treePath = ref(null); // to store the file path
const loadErrorMsg = ref(null);    // to store the error message

async function openFileDialog() {
  try {
    const selectedPath = await dialog.open({ multiple: false });
    if (selectedPath) {
      treePath.value = selectedPath;
      console.log("Selected file path:", treePath.value);
    }
  } catch (error) {
    console.error("Error selecting file:", error);
  }
}

async function promptUserAndLoadTree(resolve) {
  const oldFilePath = treePath.value;
  treePath.value = null;
  await openFileDialog();
  if (treePath.value) {
    await reloadTree();
  } else {
    treePath.value = oldFilePath;
  }
}

async function reloadTree() {
  if (treePath.value) {
    try {
      loadErrorMsg.value = await invokes.gameLoad(treePath.value);
      if (loadErrorMsg.value) {
        console.log("Couldn't load tree: ", loadErrorMsg.value);
      } else {
        store.isSolverLoaded = true;
        store.isSolverFinished = true;
        console.log("store", store);
        console.log("Successfully loaded tree: ", treePath.value);
      }
    } catch (error) {
      console.error("Error invoking backend:", error);
    }
  } else {
    console.error("No file selected");
  }
}
</script>

<style scoped>
/* Add styles if needed */
</style>
