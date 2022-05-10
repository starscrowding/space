import {useEffect, useState} from 'react';
import {NextPageContext} from 'next';
import classnames from 'classnames';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import {Loading, Button} from '@nextui-org/react';
import {Stars} from '@space/hooks/db';
import {useStar} from '@space/hooks/store';
import {Token} from '@space/components/Token';
import {BASE, ENDPOINT, OPENSEA, POOL, GRAVITY_CONTRACT} from '@space/hooks/api';
import {Logo} from '@space/components/Logo';
import styles from '../styles/token.module.scss';

interface PageContext {
  ipfs: string;
  name: string;
  id: string;
  iframe: boolean;
  listed: boolean;
}

const TokenPageContent = ({ipfs, iframe, listed}: PageContext) => {
  const {star, error, loading} = useStar(ipfs);
  const [gravity, setGravity] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Math.floor(Date.now() / 1000);
      setGravity((timestamp - star?.id) / 10 ** 6);
    }, 1234);
    return () => clearInterval(interval);
  }, [star]);

  if (error) {
    return <Error statusCode={400} />;
  }
  if (loading) {
    return (
      <div className={styles.loading}>
        <Loading type="gradient" color="white" />
      </div>
    );
  }
  if (star) {
    return (
      <div>
        {!iframe && (
          <main className={styles.main}>
            <div className={styles.container}>
              <Logo className={classnames(styles.top, styles.logo)} />
              {listed && (
                <Link href={`${OPENSEA}/${Math.abs(star.id)}`}>
                  <a target="_blank">
                    <Button id="offer" shadow color="gradient" auto className={styles.top}>
                      Buy / Sell
                    </Button>
                  </a>
                </Link>
              )}
            </div>
            {gravity && (
              <div className={styles.top}>
                <a
                  href={POOL}
                  title="Price"
                  target="_blank"
                  rel="noreferrer"
                  style={{color: 'gold'}}
                >
                  Gravity
                </a>
                :{' '}
                <a
                  href={`${GRAVITY_CONTRACT}#writeContract`}
                  title="Mining"
                  target="_blank"
                  rel="noreferrer"
                  style={{color: 'silver'}}
                >
                  {gravity}
                </a>
              </div>
            )}
          </main>
        )}
        <Token
          dataUrl={star?.head}
          style={{position: 'fixed', top: '0', bottom: '0', left: '0', right: '0'}}
        />
      </div>
    );
  }
  return null;
};

const TokenPage = (ctx: PageContext) => {
  const {ipfs, name, id} = ctx;
  if (!ipfs) {
    return <Error statusCode={404} />;
  }
  const index = `${name}*${id}`;
  const title = `${name} | starscrowding`;
  const description = `${name} token`;
  return (
    <>
      <Head>
        <link rel="canonical" href={`${BASE}/${index}`} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:image" content={`${BASE}${ENDPOINT.token.img}/${ipfs}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <TokenPageContent {...ctx} />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  try {
    const {nameid} = context?.query;
    const split = (nameid as string).split('*');
    const [name, id] = [split.shift(), split.join('')];
    const star = await Stars.findOne({name, id});
    return {
      props: {
        ipfs: star?.ipfs || null,
        name: star?.name || '',
        id: star?.id || '',
        listed: star?.listed || false,
        iframe: context?.query?.i === '1',
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {ipfs: null},
    };
  }
}

export default TokenPage;
