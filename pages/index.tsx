import { NextPage } from 'next';
import Head from 'next/head';
import { useTheme as useNextTheme } from 'next-themes';
import { useTheme, Switch, Text } from '@nextui-org/react';
import classnames from 'classnames';
import styles from '../styles/home.module.scss';

const Home: NextPage = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  return (
    <div className={styles.container}>
      <Switch
        shadow
        squared
        size={'sm'}
        checked={isDark}
        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
      />

      <Head>
        <title>strascrowding | tokens exchange space - grow * influence</title>
        <meta name="description" content="Tech company that drives improvements via web3 and blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <h1 className={styles.title}>
          welcome to <a href="#">
            <Text
              size={'4rem'}
              css={{
                display: 'inline',
                textGradient: '45deg, $pink500 27%, $purple500 42%',
              }}
              weight="bold">
              starscrowding
            </Text>
          </a>
        </h1>

        <p className={styles.description}>
          Our mission is to <b>grow</b> <code className={classnames(styles.code, styles.shadow)}>technologies</code> that allow people to <b>influence</b> improvements
        </p>

        <div className={styles.grid}>
          <a href="#" className={styles.card}>
            <h2>About 🔭</h2>
            <p>Find in-depth information about personal tokens space.</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>Charity 🎗️</h2>
            <p>How to use web3 and DeFi for the Good.</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Listings ✨</h2>
            <p>Everyone is a Star. Turn your audience into shareholders.</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Invest ⚡</h2>
            <p>
              Light up your Star. Earn by exchange your favorite tokens.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="#"
          className={styles.shadow}
        >
          in code people trust 🚀
        </a>
      </footer>
    </div>
  )
}

export default Home;
