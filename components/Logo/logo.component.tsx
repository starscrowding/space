import Link from 'next/link';
import {Text} from '@nextui-org/react';

export const Logo = ({className}: {className?: string}) => {
  return (
    <Link href="/">
      <a className={className}>
        <Text
          css={{
            display: 'inline',
            textGradient: '45deg, $pink500 27%, $purple500 42%',
          }}
          weight="bold"
        >
          starscrowding
        </Text>
      </a>
    </Link>
  );
};
