<template>
  <div class="min-w-[1080px]" :style="{ height: clientHeight + 'px' }">
    <NavBar />

    <!-- Solver Tab -->
    <div
      v-show="store.navView === 'solver'"
      class="flex w-full mx-auto max-w-screen-xl"
      style="height: calc(100% - 2.5rem)"
    >
      <SideBar style="height: calc(100% - 2rem)" />

      <div
        class="flex-grow my-4 px-6 pt-2 overflow-y-auto"
        style="height: calc(100% - 2rem)"
      >
        <div class="flex">
          <div
            :class="
              'mb-5 pl-2 pr-3 pb-0.5 text-lg font-bold border-l-8 border-b-2 ' +
              'border-blue-600 rounded rounded-br-none'
            "
          >
            {{ header }}
          </div>
        </div>

        <div v-show="store.sideView === 'oop-range'">
          <RangeEditor :player="0" />
        </div>
        <div v-show="store.sideView === 'ip-range'">
          <RangeEditor :player="1" />
        </div>
        <div v-show="store.sideView === 'board'">
          <BoardSelector />
        </div>
        <div v-show="store.sideView === 'tree-config'">
          <TreeConfig />
        </div>
        <div v-show="store.sideView === 'bunching'">
          <BunchingEffect />
        </div>
        <div v-show="store.sideView === 'run-solver'">
          <RunSolver />
        </div>
        <div v-if="store.sideView === 'about'">
          <AboutPage />
        </div>
      </div>
    </div>

    <!-- Results Tab -->
    <div
      v-show="store.navView === 'results'"
      style="height: calc(max(100%, 720px) - 2.5rem)"
    >
      <ResultViewer />
    </div>

    <!-- File Tab -->
    <div
      v-show="store.navView === 'file'"
      class="flex w-full mx-auto max-w-screen-xl"
      style="height: calc(max(100%, 720px) - 2.5rem)"
    >
      <FileSideBar style="height: calc(100% - 2rem)"  />

      <div
        class="flex-grow my-4 px-6 pt-2 overflow-y-auto"
        style="height: calc(100% - 2rem)"
      >
        <div class="flex">
          <div
            :class="
              'mb-5 pl-2 pr-3 pb-0.5 text-lg font-bold border-l-8 border-b-2 ' +
              'border-blue-600 rounded rounded-br-none'
            "
          >
            {{ fileHeader }}
          </div>
        </div>

        <!-- Save Tree -->
        <div v-show="store.fileSideView === 'save-tree'">
          <div class="flex w-full mx-auto">
          <FileSelect />
          </div>
        </div>

        <!-- Load Tree -->
        <div v-show="store.fileSideView === 'load-tree'">
          <FileSelect />
        </div>

        <!-- Load and Resolve Tree -->
        <div v-show="store.fileSideView === 'load-and-resolve-tree'">
          TODO: Load and Resolve Tree
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../store";



import NavBar from "./NavBar.vue";
import SideBar from "./SideBar.vue";
import FileSideBar from "./FileSideBar.vue";
import FileSelect from "./TreeLoader.vue";
import RangeEditor from "./RangeEditor.vue";
import BoardSelector from "./BoardSelector.vue";
import TreeConfig from "./TreeConfig.vue";
import BunchingEffect from "./BunchingEffect.vue";
import RunSolver from "./RunSolver.vue";
import AboutPage from "./AboutPage.vue";
import ResultViewer from "./ResultViewer.vue";

const store = useStore();
const header = computed(() => store.headers[store.sideView].join(" > "));
const fileHeader = computed(() => store.headers[store.fileSideView].join(" > "));

const clientHeight = ref(0);
const updateClientHeight = () => {
  clientHeight.value = document.documentElement.clientHeight - 0.01;
};

updateClientHeight();
window.addEventListener("resize", updateClientHeight);
</script>
