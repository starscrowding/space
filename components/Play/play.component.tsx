import {useState} from 'react';
import classnames from 'classnames';
import {Modal, Text} from '@nextui-org/react';
import {GoPlay} from 'react-icons/go';
import styles from './play.module.scss';

export const Play = ({className}: {className?: string}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={classnames(styles.button, className)}>
      <Text title="Intro">
        <GoPlay size="5rem" color="deeppink" onClick={() => setVisible(true)} />
      </Text>
      <Modal
        noPadding
        fullScreen
        closeButton
        aria-labelledby="intro-video"
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Modal.Body>
          <video className={styles.video} controls autoPlay playsInline>
            <source src="/intro.mp4" type="video/mp4" />
          </video>
        </Modal.Body>
      </Modal>
    </div>
  );
};
