import styles from './stars.module.scss';

export const Stars = () => {
    return <div className={styles.space}>
        <div className={styles.stars3} />
        <div className={styles.stars2} />
        <div className={styles.stars1} />
    </div>;
} 