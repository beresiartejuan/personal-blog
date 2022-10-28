import Post from "../components/Post";
import { getAllFilesMetadata } from '../lib/mdx.mjs';
import { useEffect, useState } from 'react'

export default function Posts({ AllPosts }){

    const [posts, setPosts] = useState(AllPosts);

    useEffect(() => {

        const filter_button = document.getElementById('search');

        const filter_input = document.querySelector("input[name='filter']")

        filter_button.addEventListener("click", (e) => {
            let title_wanted = filter_input.value.toLowerCase();
            let posts_found = AllPosts.filter((post) => post.title.toLowerCase().includes(title_wanted));
            setPosts(posts_found);
        });

    }, [AllPosts]);

    return (<>
        <section key="posts" className="p-10">
            <h2 className="font-semibold text-4xl mb-2">Ultimos articulos</h2>
            { posts.map((post, index) => (
                <Post title={post.title} url={post.slug} key={index}></Post>
            )) }
        </section>
    </>)

}

export async function getServerSideProps({ query }) {

    var AllPosts = await getAllFilesMetadata("posts");

    if(query?.tag){

        AllPosts = AllPosts.filter((post) => post.tags.includes(query.tag.toLowerCase()))

    }

    return {
        props: {
            AllPosts
        }
    }
}