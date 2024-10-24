<template>
  <nav
    class="sticky flex top-0 z-30 w-full h-10 shadow-lg px-4 justify-center bg-slate-800 text-gray-50"
  >
    <div class="flex relative w-full">
      <div class="flex items-center z-10">
        <div class="px-4">
          <span class="text-lg font-semibold">Desktop Postflop</span>
          <span class="pl-2 font-semibold text-gray-400">v0.2.7</span>
        </div>
      </div>

      <div class="flex ml-auto h-full items-center z-10">
        <a
          href="https://github.com/bkushigian/desktop-postflop"
          class="flex px-4 h-full items-center font-semibold hover:bg-slate-700"
          target="_blank"
        >
          <img
            src="../assets/GitHub-Mark-Light-32px.png"
            class="inline-block w-5 h-5 mr-2.5"
          />
          GitHub
        </a>
      </div>

      <!-- Nav Tabs -->
      <div
        class="flex absolute w-full h-full left-0 top-0 gap-3 justify-center"
      >
        <!-- Results -->
        <button
          :class="
            'flex relative w-32 items-center justify-center font-semibold ' +
            'transition-colors hover:bg-slate-700 hover:text-blue-200 ' +
            (store.navView === 'solver' ? 'bg-slate-700 text-blue-200' : '')
          "
          @click="store.navView = 'solver'"
        >
          <ComputerDesktopIcon class="w-6 h-6" />
          <span class="pl-3">Solver</span>
        </button>
        <!-- Results -->
        <button
          :class="
            'flex relative w-32 items-center justify-center font-semibold ' +
            'transition-colors hover:bg-slate-700 hover:text-blue-200 ' +
            (store.navView === 'results' ? 'bg-slate-700 text-blue-200' : '')
          "
          @click="store.navView = 'results'"
        >
          <ChartBarIcon class="w-6 h-6" />
          <span class="pl-3">Results</span>
        </button>

        <!-- File -->
        <button
          :class="
            'flex relative w-32 items-center justify-center font-semibold ' +
            'transition-colors hover:bg-slate-700 hover:text-blue-200 ' +
            (store.navView === 'file' ? 'bg-slate-700 text-blue-200' : '')
          "
          @click="store.navView = 'file'"
        >
          <DocumentIcon class="w-6 h-6" />
          <span class="pl-3">File</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/20/solid";
import { useStore } from "../store";
import { ComputerDesktopIcon, ChartBarIcon, CogIcon, GifIcon } from "@heroicons/vue/24/solid";
import { DocumentIcon } from "@heroicons/vue/24/outline";

const store = useStore();
</script>
