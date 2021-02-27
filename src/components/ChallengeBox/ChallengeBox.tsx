import { useContext } from 'react';
import { ChallengesContext } from '../../contexts/ChallengesContext';
import { CountdownContext } from '../../contexts/CountdownContext';
import styles from '../../styles/components/ChallengeBox.module.css';


function ChallengeBox() {
  const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext); // funções de dentro do contexto dos desafios
  const { resetCountdown } = useContext(CountdownContext); // funções de dentro do contexto da contagem regressiva

  function handleChallengeSuceeded() { // resetando o countdown quando clicar no botão Completei
    completeChallenge();
    resetCountdown();
  } 

  function handleChallengeFailed() { // resetando o countdown quando clicar no botão Falhei
    resetChallenge();
    resetCountdown();
  } 

  return (
    <div className={styles.challengeBoxContainer}>

      {/* toda a estrutura html de quando o ChallengeBox não está ativo, só vai aparecer quando não tiver desafios */}
      { activeChallenge ? ( // then
        <div className={styles.challengeActive}>          
          <header>Ganhe {activeChallenge.amount}</header>
          <main>
            <img src={`icons/${activeChallenge.type}.svg`} alt="Malhação"/>
            <strong>Novo desafio</strong>
            <p>{activeChallenge.description}</p>
          </main>
          <footer>
          <button
              type="button"
              className={styles.challengeFailedButton} 
              onClick={ handleChallengeFailed } >
                Falhei
            </button>

            <button
              type="button"
              className={styles.challengeSeccededButton} 
              onClick={ handleChallengeSuceeded } >
                Completei
            </button>
          </footer>

        </div>

      ) : ( // else        
          <div className={styles.challengeNotActive}>
            <strong>Finalize um ciclo para receber um desafio</strong>
            <p>
              <img src="icons/level-up.svg" alt="Level Up"/>
              Avance de level completando seus desafios
            </p>
        </div>
      )}

    </div>
  )
}
export default ChallengeBox;