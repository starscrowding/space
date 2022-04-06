import {useEffect, useState} from 'react';
import {useTheme as useNextTheme} from 'next-themes';
import {useTheme} from '@nextui-org/react';
import {MdOutlineLightMode, MdOutlineDarkMode} from 'react-icons/md';
import styles from './switch.module.scss';

export const LightDark = () => {
  const [ready, setReady] = useState<boolean>();
  const {setTheme} = useNextTheme();
  const {isDark} = useTheme();

  useEffect(() => {
    setTimeout(() => setReady(true), 1234);
  }, [setReady]);

  if (ready) {
    if (isDark) {
      return (
        <MdOutlineLightMode size="17" onClick={() => setTheme('light')} className={styles.switch} />
      );
    } else {
      return (
        <MdOutlineDarkMode size="17" onClick={() => setTheme('dark')} className={styles.switch} />
      );
    }
  }
  return null;
};
