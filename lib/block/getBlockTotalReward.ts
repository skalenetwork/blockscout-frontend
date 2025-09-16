import BigNumber from 'bignumber.js';

import type { Block } from 'types/api/block';

import { WEI, ZERO } from 'lib/consts';

import getBlockReward from './getBlockReward';

export default function getBlockTotalReward(block: Block) {
  const { totalReward } = getBlockReward(block);

  // Fallback to sum of all rewards if the calculation above results in zero or negative
  if (totalReward.lte(ZERO)) {
    const fallbackTotal = block.rewards
      ?.map(({ reward }) => BigNumber(reward))
      .reduce((result, item) => result.plus(item), ZERO) || ZERO;
    return fallbackTotal.div(WEI);
  }

  return totalReward.div(WEI);
}
