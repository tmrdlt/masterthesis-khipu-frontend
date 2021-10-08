import 'styles/styles.css'
import Head from 'next/head'

// eslint-disable-next-line
function MyApp({ Component, pageProps }) {
  return(
      <>
        <Head>
          <title>Khipu</title>
        </Head>
        <Component {...pageProps} />
      </>
  )
}

export default MyApp
