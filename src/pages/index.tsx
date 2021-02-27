import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { ChallengesProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';

import ExperienceBar from '../components/ExperienceBar/ExperienceBar';
import Profile from '../components/Profile/Profile';
import CompletedChallenges from '../components/CompletedChallenges/CompletedChallenges';
import Countdown from '../components/Countdown/Countdown';
import ChallengeBox from '../components/ChallengeBox/ChallengeBox';

import styles from '../styles/pages/Home.module.css';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props) {

  return (
    
    <ChallengesProvider 
      level={props.level} 
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted} >

      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>
      
        <ExperienceBar />

        {/* apenas essa seção da home precisa ter acesso ao contexto do countdown */}
        <CountdownProvider > 
          <section>

            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>

            <div>
              <ChallengeBox />
            </div>

          </section>
        </CountdownProvider>

      </div>
    </ChallengesProvider>    
  )
}


// função declarada dentro de uma página do next para manipular quais dados são repassados, da camada do next(node.js), pra camada front-end(client side)
// não é definido direto no componente porque tudo que é assíncrono e chamada pra serviço externo não ficará disponível pra motores de busca

export const getServerSideProps: GetServerSideProps = async (ctx) => { // parâmetro context sigla ctx dentro do contexto do GetServerSideProps

  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;
  
  // convertendo as props para número pois chegam como strings dos cookies
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted)
    }
  }
} // de dentro dessa função, o acesso ao serviço externo o next vai fazer a chamada API, pegar os dados e passá-los já prontos pro componente, antes mesmo de finalizar o carregamento da interface 