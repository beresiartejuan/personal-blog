import { getFileBySlug } from "../lib/mdx.mjs"
import { MDXRemote } from "next-mdx-remote";
import MDXComponents from '../components/MDXComponents';
import Tags from "../components/Tags.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

export default function AboutMe({ source, metadata }){
    return (
    <main className="max-w-6xl mt-28 mb-5 overflow-x-hidden overflow-y-auto px-12">
        <h1 className="text-6xl font-bold mb-6">{ metadata.title }</h1>
        <ul className="text-sm mb-8">
            <li key="date" className="inline-block">
                <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>&nbsp;
                { metadata.date }
            </li>
            <Tags key="tags" tags={metadata.tags} preSlug="/blog"></Tags>
        </ul>
        
        <MDXRemote {...source} components={MDXComponents} />
    </main>)
}

export async function getStaticProps(){

    const { source, metadata } = await getFileBySlug("about-me");

    return {
        props: {
            source, metadata
        }
    }

}