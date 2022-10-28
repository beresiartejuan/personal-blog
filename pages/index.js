import { getAllFilesMetadata } from '../lib/mdx.mjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Post from '../components/Post.js';
import { Title, Paragrahp } from '../components/MDXComponents.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-regular-svg-icons'
import orderByDate from '../lib/orderByDate.js';

import { MdWavingHand } from 'react-icons/md'

export default function Home({ AllPosts, AllTutorials }) {

    const [posts, setPosts] = useState(AllPosts);
    const [tutorials, setTutorials] = useState(AllTutorials);

    useEffect(() => {

        const filter_button = document.getElementById('search');

        const filter_input = document.querySelector("input[name='filter']")

        filter_button.addEventListener("click", (e) => {
            let title_wanted = filter_input.value.toLowerCase();
            let posts_found = AllPosts.filter((post) => post.title.toLowerCase().includes(title_wanted));
            setPosts(posts_found);
            let tutorials_found = AllTutorials.filter((tutorial) => tutorial.title.toLowerCase().includes(title_wanted));
            setTutorials(tutorials_found);
        });

    }, [AllPosts, AllTutorials]);

    return (
        <main className="max-w-6xl mt-28 mb-5 overflow-x-hidden overflow-y-auto px-12">
            <section className="mb-4">
                <Title>Hola! Soy Juan Beresiarte 👋</Title>
                <Paragrahp>Desarrollador Junior en Javascript y Python 💻</Paragrahp>
            </section>
            <section key="posts" className="py-5">
                <h2 className="font-semibold text-3xl mb-2">Ultimos articulos</h2>
                { posts.map((post, index) => (
                    <Post title={post.title} url={post.slug} key={index}></Post>
                )) }
            </section>
            <section key="courses" className="py-5">
                <h2 className="font-semibold text-3xl mb-2">Cursos</h2>
                { tutorials.map((tutorial, index) => (
                    <Post title={tutorial.title} url={tutorial.slug} key={index}></Post>
                )) }
            </section>
        </main>)
}

export async function getStaticProps() {

    return {
        props: {
            AllPosts: (await getAllFilesMetadata("posts")).sort(orderByDate).slice(0,4),
            AllTutorials: (await getAllFilesMetadata("tutoriales")).sort(orderByDate).slice(0,4)
        }
    }

}

/*



*/