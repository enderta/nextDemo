import Head from 'next/head';
import Layout, {siteTitle} from '../components/Layout';
import utilStyles from '../styles/utils.module.css';
import Link from "next/link";
import {useEffect, useState} from "react";

export default function Home() {
    const name = ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB']
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/hello')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])
    return (
        <>
            <div>
                <h1>
                    {data.name}
                </h1>
            </div>
            <h1>

                <ul>
                    <li>
                        <Link href={'/posts/first-post'}>
                            First Post
                        </Link>
                    </li>
                    {
                        name.map((item, index) => {
                            return <li key={index}>
                                <Link href={`/posts/${item}`}>
                                    {item}
                                </Link>
                            </li>
                        })
                    }
                    <li>
                        <Link href={'/about'}>
                            About
                        </Link>
                    </li>
                </ul>
            </h1>
        </>
    );
}