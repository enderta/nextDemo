
import { useRouter } from 'next/router'

export default function Post() {
    const router = useRouter()
        console.log(router.query.id)
        const handler= () => {
            router.push('/')
        }
    return (
        <>
            <h1>{router.query.id}</h1>
            <button onClick={handler}>Click me</button>
        </>
    )
}
