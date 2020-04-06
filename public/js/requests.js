const API_POSTS = '/api/posts';
const HTTP_HEADERS = {
    'Content-Type': 'application/json',
};

async function findAllPosts() {
    try {
        const response = await fetch(API_POSTS);
        if (!response.ok) throw Error('Posts not found');

        const posts = await response.json();
        posts.reverse().forEach(post => generatePost({ ...post, useLink: true, }));

    } catch (error) {
        console.error(error);
    }
}

/**
 * @param {number} id
 */
async function findOnePost(id) {
    try {
        const response = await fetch(`${API_POSTS}/${id}`);
        if (!response.ok) throw Error('Post not found');

        const post = await response.json();
        generatePost({ ...post, isSinglePost: true });

    } catch (error) {
        window.location.href = '/';
    }
}

/**
 * @param {{ title: string, desc: string }} post 
 */
async function createPost(post) {
    try {
        await fetch(API_POSTS, {
            method: 'POST',
            headers: HTTP_HEADERS,
            body: JSON.stringify(post),
        });

        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

/**
 * @param {{ title: string, desc: string }} post 
 */
async function updatePost(post) {
    try {
        await fetch(`${API_POSTS}/${post.id}`, {
            method: 'PATCH',
            headers: HTTP_HEADERS,
            body: JSON.stringify(post),
        });

        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

/**
 * @param {number} id 
 */
async function removePost(id) {
    try {
        await fetch(`${API_POSTS}/${id}`, {
            method: 'DELETE',
        });

        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}