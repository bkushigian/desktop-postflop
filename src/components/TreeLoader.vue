<template>
  <div>
    <!-- Hidden file input -->
    <input
      type="file"
      ref="fileInput"
      accept=".pfs"
      style="display: none;"
    />

    <!-- Custom button -->

    <button class="button-base button-blue" @click="promptUserAndLoadTree">
      Load Tree
    </button>
  </div>
  <div>
   <p v-if="loadErrorMsg" style="color: red;">Error: {{ loadErrorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useStore, useConfigStore, saveConfigToTmp, saveTmpConfigToSavedConfig } from "../store";
import { dialog } from '@tauri-apps/api';
import * as invokes from "../invokes";
import { flopTurnRiverToBoard } from '../utils';

// We need the store for loading trees.
const store = useStore();
const config = useConfigStore();
const treePath: Ref<null | string> = ref(null); // to store the file path
const loadErrorMsg: Ref<null | string> = ref(null);    // to store the error message

async function openFileDialog() {
  try {
    const selectedPath: string | string[] | null = await dialog.open({ multiple: false });
    if (selectedPath !== null) {
      if (typeof selectedPath === 'string') {
        treePath.value = (selectedPath as string);
        console.log("Selected file path:", treePath.value);
      }
      else {
        treePath.value = selectedPath[0] as string;
        console.error("Expected a single file, but got an array of files.");
      }
    }
  } catch (error) {
    console.error("Error selecting file:", error);
  }
}

async function promptUserAndLoadTree() {
  const oldFilePath = treePath.value;
  treePath.value = null;
  await openFileDialog();
  if (treePath.value) {
    await loadTree(treePath.value);
  } else {
    treePath.value = oldFilePath;
  }
}

/**
 * Load a tree from disk.
 * 
 * TODO: Specify failure modes
 */
async function loadTree(treePath: string) {
  if (treePath) {
    try {
      loadErrorMsg.value = await invokes.gameLoad(treePath);
      if (loadErrorMsg.value) {
        console.log("Couldn't load tree: ", loadErrorMsg.value);
      } else {
        store.isSolverLoaded = true;
        store.isSolverFinished = true;
        store.navView = "results";
        console.log("store", store);
        console.log("Successfully loaded tree: ", treePath);
        const gameConfigJson = await invokes.getGameConfig();
        if (typeof gameConfigJson === "object") {
          await updateConfigStoreFromTreeConfig(gameConfigJson);
          
        } else {
          // TODO: Go into error state
        }
        
      }
    } catch (error) {
      console.error("Error invoking backend:", error);
    }
  } else {
    console.error("No file selected");
  }
}

async function updateConfigStoreFromTreeConfig(gameConfig: Record<string, any>): void {
  console.log("config " + JSON.stringify(gameConfig, null, 2) + " was loaded and is object" )
  const cc = gameConfig["card_config"];
  const tc = gameConfig["tree_config"];
  console.log("cardConfig " + JSON.stringify(cc) + " was loaded and is object" )
  console.log("treeConfig " + JSON.stringify(tc) + " was loaded and is object" )

  "abc".replace("%", "");

  // Update config
  config.board = flopTurnRiverToBoard(cc.flop, cc.turn, cc.river);
  config.startingPot = tc["starting_pot"];
  config.effectiveStack = tc.effective_stack;
  config.rakePercent = tc.rake_rate;
  config.rakeCap = tc.rake_cap;

  config.donkOption =  true; // TODO

  config.oopFlopBet = tc.flop_bet_sizes[0].bets.replaceAll("%", "");
  config.oopFlopRaise = tc.flop_bet_sizes[0].raises.replaceAll("%", "");
  config.ipFlopBet = tc.flop_bet_sizes[1].bets.replaceAll("%", "");
  config.ipFlopRaise = tc.flop_bet_sizes[1].raises.replaceAll("%", "");

  config.oopTurnBet = tc.turn_bet_sizes[0].bets.replaceAll("%", "");
  config.oopTurnRaise = tc.turn_bet_sizes[0].raises.replaceAll("%", "");
  config.ipTurnBet = tc.turn_bet_sizes[1].bets.replaceAll("%", "");
  config.ipTurnRaise = tc.turn_bet_sizes[1].raises.replaceAll("%", "");
  config.oopTurnDonk = tc.turn_donk_sizes.donks.replaceAll("%", "");

  config.oopRiverBet = tc.river_bet_sizes[0].bets.replaceAll("%", "");
  config.oopRiverRaise = tc.river_bet_sizes[0].raises.replaceAll("%", "");
  config.ipRiverBet = tc.river_bet_sizes[1].bets.replaceAll("%", "");
  config.ipRiverRaise = tc.river_bet_sizes[1].raises.replaceAll("%", "");
  config.oopRiverDonk = tc.river_donk_sizes.donks.replaceAll("%", "");

  config.addAllInThreshold = tc.add_allin_threshold * 100;
  config.forceAllInThreshold = tc.force_allin_threshold * 100;
  config.mergingThreshold = tc.merging_threshold * 100;

  const oopRangeErrorString = await invokes.rangeFromString(0, cc.range[0]);
  const ipRangeErrorString = await invokes.rangeFromString(1, cc.range[1]);
  console.log(oopRangeErrorString);
  console.log(ipRangeErrorString);

  const oopWeights = await invokes.rangeGetWeights(0);
  for (let i = 0; i < 13 * 13; ++i) {
    store.ranges[0][i] = oopWeights[i] * 100;
  }

  const ipWeights = await invokes.rangeGetWeights(1);
  for (let i = 0; i < 13 * 13; ++i) {
    store.ranges[1][i] = ipWeights[i] * 100;
  }


  // TODO: What do we do with this?
  // config.expectedBoardLength = config.board.length;

  // Update store

  console.log("parsed config: ", JSON.stringify(config, null, 2));
}
function updateConfigFromCurrentTree(): void {


}
</script>

<style scoped>
/* Add styles if needed */
</style>
