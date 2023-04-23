import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";

export default function App({ Component, pageProps }) {

  return <Component {...pageProps} />
}
