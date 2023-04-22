
import { useRouter } from 'next/router'

export default function Post() {
    const router = useRouter()

    return (
        <>
            <h1>{router.query.id}</h1>
        </>
    )
}
