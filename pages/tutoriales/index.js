import Post from "../../components/Post.js";
import { getAllFilesMetadata } from '../../lib/mdx.mjs';
import { useEffect, useState } from 'react'

export default function Posts({ AllTutorials }){

    const [tutorials, setTutorials] = useState(AllTutorials);

    useEffect(() => {

        const filter_button = document.getElementById('search');

        const filter_input = document.querySelector("input[name='filter']")

        filter_button.addEventListener("click", (e) => {
            let title_wanted = filter_input.value.toLowerCase();
            let tutorials_found = AllTutorials.filter((tutorial) => tutorial.title.toLowerCase().includes(title_wanted));
            setTutorials(tutorials_found);
        });

    }, [AllTutorials]);

    return (<>
        <section key="tutorial" className="p-10">
            <h2 className="font-semibold text-4xl mb-2">Todos los tutoriales</h2>
            { tutorials.map((tutorial, index) => (
                <Post title={tutorial.title} url={tutorial.slug} key={index}></Post>
            )) }
        </section>
    </>)

}

export async function getServerSideProps({ query }) {

    var AllTutorials = await getAllFilesMetadata("tutoriales");

    if(query?.tag){

        AllTutorials = AllTutorials.filter((tutorial) => tutorial.tags.includes(query.tag.toLowerCase()))

    }

    return {
        props: {
            AllTutorials
        }
    }
}