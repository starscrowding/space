import {NextPageContext} from 'next';
import classnames from 'classnames';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import {Loading, Button} from '@nextui-org/react';
import {Stars} from '@space/hooks/db';
import {useStar} from '@space/hooks/store';
import {Token} from '@space/components/Token';
import {BASE, OPENSEA} from '@space/hooks/api';
import {Logo} from '@space/components/Logo';
import styles from '../styles/token.module.scss';

interface PageContext {
  ipfs: string;
  iframe: boolean;
  listed: boolean;
}

const TokenPageContent = ({ipfs, iframe, listed}: PageContext) => {
  const {star, error, loading} = useStar(ipfs);
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
    const index = `${star.name}*${star.id}`;
    return (
      <div>
        {!iframe && (
          <>
            <Head>
              <link rel="canonical" href={`${BASE}/${index}`} />
              <title>{`${star.name} | strascrowding`}</title>
              <meta name="description" content={star.description} />
              <meta property="og:image" content={star.image} />
            </Head>
            <main className={styles.container}>
              <Logo className={classnames(styles.main, styles.logo)} />
              {listed && (
                <Link href={`${OPENSEA}/${star.id}`}>
                  <a target="_blank">
                    <Button id="offer" shadow color="gradient" auto className={styles.main}>
                      Buy / Sell
                    </Button>
                  </a>
                </Link>
              )}
            </main>
          </>
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
  const {ipfs} = ctx;
  if (!ipfs) {
    return <Error statusCode={404} />;
  }
  return <TokenPageContent {...ctx} />;
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
