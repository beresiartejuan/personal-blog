import Link from "next/link"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { FcDownRight } from 'react-icons/fc';

export function Title({ children }){
    return (<h2 className="text-4xl font-bold my-4">{ children }</h2>)
}

export function Subtitle({ children }){
    return (<div className="text-2xl font-semibold my-6">
        <h3 className="inline-block"><FcDownRight className="inline-block mr-2"></FcDownRight>{ children }</h3>
    </div>)
} 

export function Paragrahp({ children }){
    return (<p className="text-lg my-6 text-gray-800">{ children }</p>)
}

export function Photo({ src, alt }){
    return (<img src={src} alt={alt} className="py-4 w-full max-w-2xl m-auto"></img>)
}

export function HiperLink({ children, href }){
    return (<a className="text-blue-600 font-medium" href={href} target="_blank">{ children }</a>)
}

export function MyLi({ children }){
    return (<li className="list-item">{ children }</li>)
}

export function MyList({ children }){
    return (<ul className="list-disc ml-4">
        { children.map(item => item) }
    </ul>)
}

export function Code({ children, className }){
    let language = className.split('-')[1];
    return (<SyntaxHighlighter language={ language } style={dracula}>
        { children }
    </SyntaxHighlighter>)
}

export default {
    h2: Title,
    h3: Subtitle,
    p: Paragrahp,
    img: Photo,
    a: HiperLink,
    li: MyLi,
    ul: MyList,
    code: Code
}