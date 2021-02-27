// Regras de negócio da aplicação; Funções do challenge serão acessadas por outros componentes da aplicação:

import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import challenges from '../../challenges.json'; // todos os desafios dentro de um array em formato JSON
import { LevelUpModal } from '../components/LevelUpModal/LevelUpModal';

interface Challenge { // é recomendado detalhar quais propriedades o objeto possui
  type: 'body' | 'eye'; // é uma string mas como temos apenas dois valores podemos declará-los
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  experienceToNextLevel: number;
  currentExperience: number 
  challengesCompleted: number;
  activeChallenge: Challenge;
  resetChallenge: () => void; // função que não tem retorno
  completeChallenge: () => void;
  startNewChallenge: () => void;
  levelUp: () => void;
  closeLevelUpModal: () => void;
}

interface ChallengesProviderProps { // o componente+Props recebe a propriedade children
  children: ReactNode; // uma boa prática é fazer uma tipagem do children, onde o ReactNode aceita qualquer elemento filho
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}


export const ChallengesContext = createContext({} as ChallengesContextData); // declarando o tipo do contexto, já definido acima 

export function ChallengesProvider({ // desestruturando as propriedades de children, que é todo o conteúdo de um componente
  children, 
  ...rest // todas as propriedades que não são a children estão armazenadas no rest operator 
}: ChallengesProviderProps) { 
  
  const [level, setLevel] = useState(rest.level ?? 1); // verifica o level, se não existir inicia em 1
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
  const [activeChallenge, setActiveChallenge] = useState(null); // criando um estado pra armazenar o challenge aleatório que inicia vazio
  const [isLevelUpModalOpen, SetIsLevelUpModalOpen] = useState(false); // abrir o modal apenas quando o usuário subir de nível
  
  
  // calculando o quanto que usuário precisa de experiência pra avançar de level, baseado no level que está atualmente
  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)  // cálculo de rpg baseado em raiz quadrada/potência - pow, na potência 2, de qual o próximo level vezes fator de experiência 4 (nível de dificuldade)

  // solicitando a permissão do usuário para enviar notificações de novos desafios
  useEffect(() => { // passando como 2º parâmetro um array vazio; executa a arrow function uma única vez quando o componente for exibido em tela
    Notification.requestPermission(); // API do próprio browser
  }, []) 

  // disparando a função sempre que tiver mudança nas variáveis armazenadas nos cookies: nível, experiência ou desafio completado
  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted]) 

  function levelUp() {
    setLevel(level + 1);
    SetIsLevelUpModalOpen(true);
  }

  function startNewChallenge() {
    // capturando desafios:  
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length); // retornando um nº aleatório/randômico entre 0 e o número final que nesse caso é o tamanho total dos desafios; arrendondando pra baixo com o floor
    const challenge = challenges[randomChallengeIndex]; // variável challenge com um index aleatório e específico

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play(); // API do próprio browser

    if (Notification.permission === 'granted') { // se usuário deu permissão às notificações
      new Notification('Novo desafio 🏆', { // uma notificação será enviada a cada novo desafio
        body: `Valendo ${challenge.amount}xp !`
      }) 
    }
  }

  function resetChallenge() { // função chamada quando o usuário clicar no botão Falhei
    setActiveChallenge(null); // voltando ao activeChallenge para o valor inicial
  }

  function completeChallenge() { // função que irá completar um desafio quando clicar no botão Completei; // não precisa de parâmetros pois já foram definidos no activeChallenge: qual o desafio, quanto de experência vale...
    if (!activeChallenge) {
      return; // return void, apenas para validação; essa função não pode ser chamada se usuario não estiver com desafio ativo
    }

    const { amount } = activeChallenge // buscando a propriedade amount do desafio ativo o quanto de experiência ele oferece
    let finalExperience = currentExperience + amount // somando a experiência atual com a experiência adquirida

    if (finalExperience >= experienceToNextLevel) { // subir o usuario de nível e, se for o caso, considerar o saldo da experiência anterior 
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    } 

    setCurrentExperience(finalExperience); // atualizando a experiência do usuario
    setActiveChallenge(null); // quando terminar o desafio é preciso zerá-lo
    setChallengesCompleted(challengesCompleted + 1); // atualizando o numero de desafios completados
  }

  function closeLevelUpModal() {
    SetIsLevelUpModalOpen(false);
  }

  return (
    // dentro do Context há um componente Provider e todos os elementos dentro dele terão acesso aos dados daquele contexto
    <ChallengesContext.Provider     
    value={{ // propriedade value é o que será enviado de informação
      level,
      levelUp,
      experienceToNextLevel,
      currentExperience, 
      challengesCompleted,
      activeChallenge,
      resetChallenge,
      completeChallenge,
      startNewChallenge,
      closeLevelUpModal,
      }} >  
      { children }

      { isLevelUpModalOpen && <LevelUpModal /> }
    </ChallengesContext.Provider>
  );
}