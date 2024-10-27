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
import { debug, error, trace } from '../log';

// We need the store for loading trees.
const store = useStore();
const config = useConfigStore();
const treePath: Ref<null | string> = ref(null); // to store the file path
const loadErrorMsg: Ref<null | string> = ref(null);    // to store the error message

async function openFileDialog() {
  trace(`openFileDialog()`);
  try {
    const selectedPath: string | string[] | null = await dialog.open({ multiple: false });
    if (selectedPath !== null) {
      if (typeof selectedPath === 'string') {
        treePath.value = (selectedPath as string);
        debug("Selected file path:", treePath.value);
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
  trace(`promptUserAndLoadTree()`);
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
  trace(`Loading tree ${treePath}`);
  if (treePath) {
    try {
      store.isTreeLoaded = false;
      store.isSolverFinished = false;
      store.isTreeLoading = true;
      store.isConfigLoaded = false;
      store.loadedTreePath = "";

      loadErrorMsg.value = await invokes.gameLoad(treePath);

      if (loadErrorMsg.value) {
        error(`Couldn't load tree: ${loadErrorMsg.value}`);
      } else {
        store.isTreeLoaded = true;
        store.isSolverFinished = true;
        store.isTreeLoading = false;
        store.loadedTreePath = treePath;
        store.isSolverError = false;
        debug(`Successfully loaded tree: ${treePath}`);

        store.navView = "results";
        const gameConfigJson = await invokes.getGameConfig();
        if (typeof gameConfigJson === "object") {
          store.isConfigLoaded = false;
          await updateConfigStoreFromTreeConfig(gameConfigJson);
          store.isConfigLoaded = true;
        } else {
          error("Error");
          store.isSolverError = true;
        }
        
      }
    } catch (error) {
      const message = `Error invoking backend: ${error}`;
      debug(message);
    }
  } else {
    console.error("No file selected");
  }
}

/**
 * Update the config from the {@code gameConfig} record.
 * 
 */
async function updateConfigStoreFromTreeConfig(gameConfig: Record<string, any>): Promise<string | null>{
  const cc = gameConfig["card_config"];
  const tc = gameConfig["tree_config"];
  debug("cardConfig:\n" + JSON.stringify(cc, null, 2) + "\nwas loaded and is object" )
  debug("treeConfig:\n" + JSON.stringify(tc) + "\nwas loaded and is object" )
  debug("addedLines:", config.addedLines);
  debug("removedLines:", config.removedLines);

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
  if (oopRangeErrorString) {
    error(oopRangeErrorString);
    store.isSolverError = true;
    return oopRangeErrorString;
  }

  const ipRangeErrorString = await invokes.rangeFromString(1, cc.range[1]);
  if (ipRangeErrorString) {
    error(ipRangeErrorString);
    store.isSolverError = true;
    return ipRangeErrorString;
  }

  const oopWeights = await invokes.rangeGetWeights(0);
  for (let i = 0; i < 13 * 13; ++i) {
    store.ranges[0][i] = oopWeights[i] * 100;
  }
  debug("oopWeights:[", oopWeights.join(","), "]");

  const ipWeights = await invokes.rangeGetWeights(1);
  for (let i = 0; i < 13 * 13; ++i) {
    store.ranges[1][i] = ipWeights[i] * 100;
  }
  debug("ipWeights:[", ipWeights.join(","), "]");


  // TODO: What do we do with this?
  // config.expectedBoardLength = config.board.length;

  saveConfigToTmp();
  saveTmpConfigToSavedConfig();
  return null;
}
</script>

<style scoped>
/* Add styles if needed */
</style>
