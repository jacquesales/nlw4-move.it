import { useContext } from 'react';
import { ChallengesContext } from '../../contexts/ChallengesContext';
import styles from '../../styles/components/Profile.module.css';

function Profile() {
  const { level } = useContext(ChallengesContext);

  return (

    <div className={styles.profileContainer}>
      <img src="https://imgur.com/lbEqqCL.png" alt="Bel Foster" />

      <div>
        <strong>Bel Foster</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level { level }</p>
      </div>

    </div>
  )
}
export default Profile;