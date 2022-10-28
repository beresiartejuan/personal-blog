import Link from "next/link"

export default function Post({ title, url }){
    return (<Link href={url}><div className="p-4 mb-1 border-solid border-b-2 border-b-slate-900 cursor-pointer text-lg">
        <span>{ title }</span>
    </div></Link>)
}