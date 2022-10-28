import Link from "next/link";

export default function Tags({ tags, preSlug = "" }){
    return (<>
        { tags.map((tag, index) => (
            <Link href={`${preSlug}/?tag=${tag}`}>
                <li key={ index } className="inline-block bg-yellow-300 px-2 m-2 rounded-lg text-gray-500 cursor-pointer">{ tag }</li>
            </Link>
            
        )) }
    </>)
}