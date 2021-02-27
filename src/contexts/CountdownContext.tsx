// Regras de negócio da aplicação; Funções do countdown serão acessadas por outros componentes da aplicação:

import { createContext, ReactNode, useContext, useEffect, useState } from "react"; // useEffect é um hook de efeitos colaterais: quando algo acontecer é disparada alguma função 
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData { // tipos de dados que serão retornados de dentro desse contexto
  minutes: number;
  seconds: number;
  isActive: boolean;
  hasFinished: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}


export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;  // tipagem global da variável para definir qual o formato dela

export function CountdownProvider({ children }: CountdownProviderProps) {
  // o countdown que iniciará um novo challenge
  const { startNewChallenge } = useContext(ChallengesContext); // desestruturando o contexto
  const [time, setTime] = useState(25 * 60); // tempo inicial do countdown em segundos
  const [isActive, setIsActive] = useState(); // armazena a informação de quando o countdown está acontecendo/ativo
  const [hasFinished, setHasFinished] = useState(false); // inicia como false porque essa condição será setada depois 
  const minutes = Math.floor(time / 60); // arredondando pra baixo, desconsiderando segundos restantes
  const seconds = time % 60; // resto da divisão pra considerar os segundos restantes 

  function startCountdown() {
    setIsActive(true); // no começo precisa ativar o countdown, então ao clicar no botão será setado o valor
  }

  // a função tem o objetivo de suspender, então partir desse momento vai parar de executar
  function resetCountdown() { // porém quando parar o countdown, a função abaixo já terá executado - 1, nesse caso incluir a variável countdownTimeout pra tratar esse detalhe    
    clearTimeout(countdownTimeout) // quando resetar o countdown, dar um clear passando a variável countdownTimeout cancelando assim sua execução
    setIsActive(false); // parando de executar
    setHasFinished(false); // voltando para a condição inicial do countdown
    setTime(25 * 60) // quando for parado o countdown, o setTime deve ser atualizado e o time deve voltar para seu estado inicial
  } 

  // 1º parâmetro: função do que quero executar, 2º parâmetro: quando quero executar
  // nesse caso executar a função startCountDown sempre que o valor de active mudar
  useEffect( () => {
    if (isActive && time > 0) { // se estou com countdown ativo e time for maior que 0
      countdownTimeout = setTimeout(() => { // a variável irá armazenar a função nativa setTimeout dispara outra função aqui uma arrow function, no tempo que for definido, nesse caso, 1 segundo
        setTime(time - 1); // essa arrow function tira 1 segundo do time e atualiza o setTime 
      }, 1000)
    }  else if (isActive && time === 0) { // verificando se o countdown chegou até o final
      setHasFinished(true); // aqui o estado setHasFinished será atualizado
      setIsActive(false); // e o contdown não estará mais ativo
      startNewChallenge(); // quando o time chega a 0, a função startNewChallenge irá disparar um novo desafio
    }
  }, [isActive, time]) // além de xecutar toda essa função quando o active mudar, executar também quando o time muda (a cada 1 segundo a função é disparada)
  

  return (
    <CountdownContext.Provider 
    value={{
      minutes,
      seconds,
      isActive,
      hasFinished,
      startCountdown,
      resetCountdown
    }}>
      {children}
    </CountdownContext.Provider>
  )
}