// o app abrange todas as páginas
import { ChallengesProvider } from '../contexts/ChallengesContext';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {

  // este componente fica por volta da aplicação, algo que é reaproveitado em todas as páginas  
  return ( 
    <Component {...pageProps} />  
  )
}
export default MyApp