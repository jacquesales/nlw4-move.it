import { useContext } from 'react';
import { ChallengesContext } from '../../contexts/ChallengesContext';

import styles from '../../styles/components/ExperienceBar.module.css';

function ExperienceBar() {
  const { currentExperience, experienceToNextLevel } = useContext(ChallengesContext); // utilizando os contextos de experiência do usuário (qual a experiência atual e quanto falta pra alcançar o próx level) 
  const percentToNextLevel = Math.round(currentExperience * 100) / experienceToNextLevel // calculando o progresso da barra de experiência
  return (

    <header className={styles.experienceBar} >
      <span>0 xp</span>
      <div>    

        <div style={{ width: `${ percentToNextLevel }%` }} /> { /* estilo definido inline pois consigo controlá-lo como uma variável; no css é tudo estático */}
        
        <span className={styles.currentExperience} style={{ left: `${ percentToNextLevel }%` }}>
          {currentExperience} px
        </span>

      </div>
      <span>{ experienceToNextLevel } xp</span>
    </header>
  )
}
export default ExperienceBar;