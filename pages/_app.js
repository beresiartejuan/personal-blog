import '../styles/globals.css'
import App from 'next/app'
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-slate-200 h-screen overflow-x-hidden overflow-y-auto grid place-content-center w-full scrollbar-track-red-600">
      <Navbar></Navbar>
      <Component {...pageProps} />
  </div>
  )
}

MyApp.getInitialProps = async (appContext) => {
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { ...pageProps }
};

export default MyApp
