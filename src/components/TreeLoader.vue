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

    <button class="button-base button-blue" @click="triggerTreeLoadDialog">
      Load Tree
    </button>
  </div>
  <div>
   <p v-if="error" style="color: red;">Error: {{ error }}</p>
  </div>
</template>

<script>
import * as invokes from "../invokes";
export default {
  data() {
    return {
      fileName: null, // to store the file name
      error: null,
    };
  },
  methods: {

    /**
     * Handle the click on our button
     */
    triggerTreeLoadDialog() {
      // Trigger the hidden file input click event
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.error = null;
      const file = event.target.files[0]; // get the selected file

      if (file) {
        this.fileName = file.name; // store the file name for display
        this.loadFile(file); // call a method to handle the file
      }
    },
    loadFile(file) {
      console.log("Loading file", file);
      const error = invokes.gameLoad(file);
      if (error) {
        this.error = error;
      }
    },
  },
};
</script>

<style scoped>
/* Add styles if needed */
</style>
