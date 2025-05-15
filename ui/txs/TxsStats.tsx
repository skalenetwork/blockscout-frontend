import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { thinsp } from 'lib/html-entities';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { TXS_STATS } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const TxsStats = () => {
  const txsStatsQuery = useApiQuery('txs_stats', {
    queryOptions: {
      placeholderData: TXS_STATS,
    },
  });

  const statsQuery = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (!txsStatsQuery.data) {
    return null;
  }

  const txFeeAvg = getCurrencyValue({
    value: txsStatsQuery.data.transaction_fees_avg_24h,
    exchangeRate: statsQuery.data?.coin_price,
    decimals: String(config.chain.currency.decimals),
    accuracyUsd: 2,
  });

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(4, calc(25% - 9px))' }}
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
    >
      <StatsWidget
        label="Transactions"
        value={ Number(txsStatsQuery.data?.transactions_count_24h).toLocaleString() }
        period="24h"
        isLoading={ txsStatsQuery.isPlaceholderData }
        href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'newTxns' } } : undefined }
      />
      <StatsWidget
        label="Pending transactions"
        value={ Number(txsStatsQuery.data?.pending_transactions_count).toLocaleString() }
        period="1h"
        isLoading={ txsStatsQuery.isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(TxsStats);
