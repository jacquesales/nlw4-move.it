import { useContext } from 'react'; 
import { CountdownContext } from '../../contexts/CountdownContext';

import styles from '../../styles/components/Countdown.module.css';


function Countdown() {  

  const {
    minutes, 
    seconds, 
    isActive, 
    hasFinished, 
    startCountdown, 
    resetCountdown
  } = useContext(CountdownContext);
   
  // const minuteLeftRight = String(minutes).padStart(2, '0').split(''); split separa  s t r i n g s
  // transformando o nº em string, no caso de apenas um caracter (ex. 5 minutos) o padStart verifica se não tiver 2 carasteres ele preenche o restante pra esquerda (ex. 05 minutos)
  // como o split devolve a separação em um array (com posições) podemos desestruturá-lo para trabalhar com cada posição
  // não foi enviado ao contexto porque se refere apenas ao layout, da forma como o número deve se apresentar na página
  const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
  const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');
  
   
  return (
    <div>

      <div className={styles.countdownContainer}>      
      
        <div>
          <span>{ minuteLeft }</span>
          <span>{ minuteRight }</span>
        </div>

        <span>:</span>

        <div>
          <span>{ secondLeft }</span>
          <span>{ secondRight }</span>
        </div>
      </div>

      {/* já temos uma função que verifica se está ativo, então, enquanto o countdown estiver ativo mostrar o botão de outra forma */}
      {/* if ternário */}

      {hasFinished ? ( // caso tenha terminado, se, então ...
        <div>
          <button
            disabled            
            className={styles.countdownButton} >
            Ciclo encerrado
          </button>
        </div>

      ) : ( // os botões abaixo só devem ser executados quando o ciclo não tiver sido encerrado      
      <>
        { isActive ? (
          <div>
            <button 
              type="button" 
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={ resetCountdown } >
              Abandonar o ciclo
            </button>
        </div>
        ) : (
          <div>
            <button 
              type="button" 
              className={styles.countdownButton}
              onClick={ startCountdown } >
              Iniciar um ciclo
            </button>
          </div>
          )}
        </>    
      )}
    </div>
  );
}
export default Countdown;