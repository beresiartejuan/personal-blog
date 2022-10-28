import { getFiles, getFileBySlug } from "../../lib/mdx.mjs"
import { MDXRemote } from "next-mdx-remote";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Tags from '../../components/Tags.js';
import MDXComponents from '../../components/MDXComponents.js';

export default function Tutorial({ source, metadata }){
    return (
    <main className="mt-28 mb-5 w-screen sm:max-w-6xl overflow-x-hidden overflow-y-auto px-12">
        <h1 className="text-5xl font-bold mb-6">{ metadata.title }</h1>
        <ul className="text-sm mb-8">
            <li key="date" className="inline-block">
                <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>&nbsp;
                { metadata.date }
            </li>
            <Tags key="tags" tags={metadata.tags} preSlug="/tutoriales"></Tags>
        </ul>
        
        <MDXRemote {...source} components={MDXComponents} />
    </main>)
}

export async function getStaticProps({ params }){

    const { source, metadata } = await getFileBySlug("tutoriales", params.slug);

    return {
        props: {
            source, metadata
        }
    }

}

export async function getStaticPaths(){

    const posts = getFiles("tutoriales");

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