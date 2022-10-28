import { getFiles, getFileBySlug } from "../lib/mdx.mjs"
import { MDXRemote } from "next-mdx-remote";
import MDXComponents from '../components/MDXComponents';
import Tags from "../components/Tags.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { BsCalendarDate } from 'react-icons/bs';

export default function Post({ source, metadata }){
    return (
    <main className="w-screen sm:w-auto sm:max-w-6xl mt-28 mb-5 overflow-x-hidden overflow-y-auto px-12">
        <h1 className="text-5xl font-bold mb-6">{ metadata.title }</h1>
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

export async function getStaticProps({ params }){

    const { source, metadata } = await getFileBySlug("posts", params.slug);

    return {
        props: {
            source, metadata
        }
    }

}

export async function getStaticPaths(){

    const posts = getFiles("posts");

    const paths = posts.map(post => ({
        params: {
            slug: post.replace('.mdx', '')
        }
    }))

    return {
        paths,
        fallback: false
    }

}