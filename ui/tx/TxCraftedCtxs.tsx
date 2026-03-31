import { Table, Tbody, Thead, Tr, Th, Td, Text } from '@chakra-ui/react';
import React from 'react';

import type { SkaleCraftedCtxItem } from 'types/api/skaleCraftedCtxs';

import useApiQuery from 'lib/api/useApiQuery';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxCraftedCtxs = ({ txQuery }: Props) => {
  const { data, isPlaceholderData, isError } = useApiQuery('tx_crafted_ctxs', {
    pathParams: { hash: txQuery.data?.hash },
    queryOptions: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txQuery.isError) {
    return <DataFetchAlert/>;
  }

  const items: Array<SkaleCraftedCtxItem> = data?.items ?? [];

  if (!isPlaceholderData && items.length === 0) {
    return <Text as="span">There are no crafted CTXs for this transaction.</Text>;
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th width="80px">#</Th>
          <Th>Transaction hash</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <Tr key={ item.hash + String(index) }>
            <Td verticalAlign="middle">
              <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">
                { index + 1 }
              </Skeleton>
            </Td>
            <Td verticalAlign="middle">
              <TxEntity
                hash={ item.hash }
                isLoading={ isPlaceholderData }
                noIcon={ false }
                noCopy={ false }
              />
            </Td>
          </Tr>
        )) }
      </Tbody>
    </Table>
  );
};

export default TxCraftedCtxs;
