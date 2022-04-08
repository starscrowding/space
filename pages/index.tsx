import {FormEvent, useCallback, useState} from 'react';
import {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {Text, Input, StyledInput} from '@nextui-org/react';
import {GoTelescope} from 'react-icons/go';
import classnames from 'classnames';
import {IStar} from '@space/types';
import {api, ENDPOINT, BASE, ABOUT, FAQ, GITHUB} from '@space/hooks/api';
import {useStar} from '@space/hooks/store';
import styles from '../styles/home.module.scss';

const StarPreview = ({star}: {star: IStar}) => {
  const meta = useStar(star?.ipfs);
  const index = `${star.name}*${star.id}`;
  return (
    <Link href={`/${index}`}>
      <a className={styles.star}>
        <img width="200px" src={meta?.star?.image} />
        <Text
          size="1.23rem"
          css={{
            textGradient: '45deg, gold -20%, white 100%',
          }}
          weight="bold"
        >
          {index}
        </Text>
      </a>
    </Link>
  );
};

const Home: NextPage = () => {
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState<string>('');
  const [stars, setStars] = useState<[]>();

  const onSearch = useCallback(
    async (e: FormEvent) => {
      e?.preventDefault?.();
      let _stars = [];
      try {
        if (input) {
          const result = await api(`${ENDPOINT.token.search}?q=${input}`);
          _stars = result?.stars;
        }
      } finally {
        setStars(_stars);
      }
    },
    [input]
  );

  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={BASE} />
        <title>strascrowding | tokens exchange space - grow * influence</title>
        <meta
          name="description"
          content="Tech company that drives improvements via web3 and blockchain."
        />
        <meta property="og:image" content={`${BASE}/icon.png`} />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          welcome to{' '}
          <a href="/">
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
        </h1>

        <div className={styles.search}>
          <form onSubmit={onSearch}>
            <Input
              id="search"
              bordered
              width="100%"
              color="primary"
              placeholder="Look for Star tokens"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onChange={e => setInput(e?.target?.value || '')}
              contentLeft={<GoTelescope size="17" />}
            />
          </form>
        </div>

        {!!stars?.length && (
          <div className={styles.stars}>
            {stars.map((star: any, index: number) => {
              return <StarPreview key={index} star={star} />;
            })}
          </div>
        )}

        {!focus && !stars?.length && (
          <div className={styles.grid}>
            <a href={ABOUT} target="_blank" className={styles.card}>
              <h2>About 💫</h2>
              <p>Find in-depth information about personal tokens space.</p>
            </a>

            <a href={FAQ} target="_blank" className={styles.card}>
              <h2>Charity 🎗️</h2>
              <p>How to use web3 and DeFi for the Good.</p>
            </a>

            <a href={FAQ} target="_blank" className={styles.card}>
              <h2>Listings ✨</h2>
              <p>Everyone is a Star. Turn your audience into shareholders.</p>
            </a>

            <a href={FAQ} target="_blank" className={styles.card}>
              <h2>Invest ⚡</h2>
              <p>Light up your Star. Earn by exchange your favorite tokens.</p>
            </a>
          </div>
        )}
      </main>

      <p className={styles.description}>
        Our mission is to <b>grow</b>{' '}
        <code className={classnames(styles.code, styles.shadow)}>technologies</code> that allow
        people to <b>influence</b> improvements
      </p>

      <footer className={styles.footer}>
        <a href={GITHUB} target="_blank" className={styles.shadow}>
          in code people trust 🚀
        </a>
      </footer>
    </div>
  );
};

export default Home;
