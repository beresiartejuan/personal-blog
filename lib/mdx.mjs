import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import fs from 'fs';
import path from 'path';

const root = process.cwd();

export const getFiles = (type) => fs.readdirSync(path.join(root, "data", type));

export const getFileBySlug = async (type, slug) => {
    const sourcemdx = slug ? 
        fs.readFileSync(path.join(root, "data", type, `${slug}.mdx`), "utf-8") :
        fs.readFileSync(path.join(root, "data", `${type}.mdx`), "utf-8");

    const { data, content } = await matter(sourcemdx);

    const source = await serialize(content, {});

    return {
        source,
        metadata: {
            slug: slug ? slug : type,
            ...data
        }
    }
};

export const getAllFilesMetadata = async (type) => {
    const files = getFiles(type);

    let allFilesMetadata = [];

    for (let slug of files){
        slug = slug.replace('.mdx', '');
        const { metadata } = await getFileBySlug(type, slug);
        allFilesMetadata.push({ ...metadata, slug: type !== "posts" ? `${type}/${metadata.slug}` : metadata.slug });
    }

    return allFilesMetadata;
}