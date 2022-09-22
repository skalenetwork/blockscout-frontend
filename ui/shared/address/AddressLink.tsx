import { Link, chakra, shouldForwardProp } from '@chakra-ui/react';
import React from 'react';

import useLink from 'lib/link/useLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  type?: 'address' | 'transaction' | 'token';
  className?: string;
  hash: string;
  truncation?: 'constant' | 'dynamic'| 'none';
  fontWeight?: string;
}

const AddressLink = ({ type, className, truncation = 'dynamic', hash, fontWeight }: Props) => {
  const link = useLink();
  let url;
  if (type === 'transaction') {
    url = link('tx_index', { id: hash });
  } else if (type === 'token') {
    url = link('token_index', { id: hash });
  } else {
    url = link('address_index', { id: hash });
  }

  const content = (() => {
    switch (truncation) {
      case 'constant':
        return <HashStringShorten hash={ hash }/>;
      case 'dynamic':
        return <HashStringShortenDynamic hash={ hash } fontWeight={ fontWeight }/>;
      case 'none':
        return <span>{ hash }</span>;
    }
  })();

  return (
    <Link
      className={ className }
      href={ url }
      target="_blank"
      overflow="hidden"
      whiteSpace="nowrap"
    >
      { content }
    </Link>
  );
};

const AddressLinkChakra = chakra(AddressLink, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    // forward fontWeight to the AddressLink since it's needed for underlying HashStringShortenDynamic component
    if (isChakraProp && prop !== 'fontWeight') {
      return false;
    }

    return true;
  },
});

export default React.memo(AddressLinkChakra);
