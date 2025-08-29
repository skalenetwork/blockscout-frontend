import BigNumber from 'bignumber.js';

import type { Block } from 'types/api/block';
import config from 'configs/app';

export default function getBlockReward(block: Block) {
  const txFees = BigNumber(block.transaction_fees || 0);
  const burntFees = BigNumber(block.burnt_fees || 0);
  const minerReward = BigNumber(block.rewards?.find(({ type }) => type === 'Miner Reward' || type === 'Validator Reward')?.reward || 0);
  const staticReward = config.chain.staticBlockReward ?
    BigNumber(config.chain.staticBlockReward) :
    minerReward.minus(txFees).plus(burntFees);
  const totalReward = staticReward.plus(txFees).minus(burntFees);

  return {
    totalReward,
    staticReward,
    txFees,
    burntFees,
  };
}
