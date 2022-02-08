import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>strascrowding | grow * influence</title>
        <meta name="description" content="Tech company that drives improvements via blockchain." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          welcome to <a href="#">starscrowding</a>
        </h1>

        <p className={styles.description}>
          Our mission is to <b>grow</b> <code className={styles.code}>technologies</code> that allow people to <b>influence</b> improvements.
        </p>

        <div className={styles.grid}>
          <a href="#" className={styles.card}>
            <h2>About 📄</h2>
            <p>Find in-depth information about the project.</p>
          </a>

          <a href="#" className={styles.card}>
            <h2>Help 🤝</h2>
            <p>How to use the web3 and DeFi for good.</p>
          </a>

          <a
            href="#"
            className={styles.card}
          >
            <h2>Listings ✨</h2>
            <p>Everyone is a Star.</p>
          </a>

          <a
            href=""
            className={styles.card}
          >
            <h2>Invest ⚡</h2>
            <p>
              Light up your Star.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="#"
        >
          in code people trust 🚀
        </a>
      </footer>
    </div>
  )
}

export default Home;
