import {FormEvent, useCallback, useEffect, useState} from 'react';
import {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {GoTelescope, GoX} from 'react-icons/go';
import classnames from 'classnames';
import {Text, Input, Loading} from '@nextui-org/react';
import {IStar} from '@space/types';
import {
  api,
  ENDPOINT,
  BASE,
  ABOUT,
  WHITEPAPER,
  FAQ,
  GITHUB,
  COLLECTION,
  FORM,
} from '@space/hooks/api';
import {useStar} from '@space/hooks/store';
import {Logo} from '@space/components/Logo';
import {Play} from '@space/components/Play';
import styles from '../styles/home.module.scss';

const StarPreview = ({star}: {star: IStar}) => {
  const meta = useStar(star?.ipfs);
  const index = `${star.name}*${star.id}`;
  return !!meta?.star?.image ? (
    <Link href={`/${index}`}>
      <a className={styles.star}>
        <Image width="200px" height="200px" src={meta?.star?.image} alt={meta?.star?.description} />
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
  ) : (
    <a className={classnames(styles.star, styles.loading)}>
      <Loading type="gradient" color="white" />
    </a>
  );
};

const Home: NextPage = () => {
  const [go, setGo] = useState(0);
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState<string>('.');
  const [stars, setStars] = useState<[]>();
  const [loading, setLoading] = useState(false);

  const onSearch = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault?.();
      let _stars = [];
      setLoading(true);
      try {
        if (input) {
          const result = await api(`${ENDPOINT.token.search}?q=${input}`);
          _stars = result?.stars;
        }
      } finally {
        setLoading(false);
        setStars(_stars);
      }
    },
    [input]
  );

  useEffect(() => {
    if (focus && !stars?.length) {
      onSearch();
    }
  }, [focus, stars, onSearch]);

  return (
    <>
      <Head>
        <link rel="canonical" href={BASE} />
        <title>starscrowding | tokens exchange space - grow * influence</title>
        <meta
          name="description"
          content="Tech company that drives improvements via web3 and blockchain."
        />
        <meta property="og:image" content={`${BASE}/icon.png`} />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title} onClick={() => setStars(undefined)}>
            welcome to <Logo />
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
                onChange={e => setInput(e?.target?.value || '.')}
                contentLeft={<GoTelescope size="17" />}
                contentRight={loading ? <Loading type="points-opacity" color="white" /> : null}
              />
            </form>
            <div>
              <a href={COLLECTION} target="_blank" rel="noreferrer">
                » explore all
              </a>
            </div>
          </div>

          {!!stars?.length && (
            <div className={classnames(styles.grid, styles.stars)}>
              {stars.map((star: any, index: number) => {
                return <StarPreview key={index} star={star} />;
              })}
            </div>
          )}

          {!focus && !stars?.length && (
            <div className={styles.grid}>
              <Play className={styles.play} />
              <a href={ABOUT} target="_blank" rel="noreferrer" className={styles.card}>
                <h2>About 💫</h2>
                <p>Find in-depth information about personal tokens space.</p>
                <p
                  className={styles.tag}
                  onClick={e => {
                    e?.preventDefault?.();
                    window.open(WHITEPAPER, '_blank');
                  }}
                >
                  #whitepaper
                </p>
              </a>

              <a href={FAQ} target="_blank" rel="noreferrer" className={styles.card}>
                <h2>Charity 🎗️</h2>
                <p>How to use web3 and DeFi for the Good.</p>
                <p className={styles.tag}>#faq</p>
              </a>

              <a href={FORM} target="_blank" rel="noreferrer" className={styles.card}>
                <h2>Listings ✨</h2>
                <p>Everyone is a Star. Turn your audience into shareholders.</p>
                <p className={styles.tag}>#create #mint</p>
              </a>

              <a href={COLLECTION} target="_blank" rel="noreferrer" className={styles.card}>
                <h2>Invest ⚡</h2>
                <p>Light up your Star. Earn by exchange your favorite tokens.</p>
                <p className={styles.tag}>#buy #sell</p>
              </a>
            </div>
          )}
        </main>

        <p className={styles.description}>
          Our mission is to <b>grow</b>{' '}
          <code className={classnames(styles.code, styles.shadow)} onClick={() => setGo(go + 1)}>
            technologies
          </code>{' '}
          that allow people to <b>influence</b> improvements
        </p>

        <footer className={styles.footer}>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className={styles.shadow}
            title="verify"
          >
            in code people trust{' '}
          </a>
          <i className={classnames(styles.rocket, {[styles.go]: go % 2})}>🚀</i>
        </footer>
      </div>
    </>
  );
};

export default Home;
