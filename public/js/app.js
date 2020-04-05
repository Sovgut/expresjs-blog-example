const API_POSTS = '/api/posts';
const TITLE_TAG = 'h1';
const DESC_TAG = 'p';
const HTTP_HEADERS = {
    'Content-Type': 'application/json',
};

async function boot() {
    const [_, postId] = window.location.search.replace('?', '').split('=');
    const loadAll = isNaN(Number(postId)) ? true : false;

    if (loadAll) {
        await findAllPosts();
    } else {
        await findOnePost(postId);
    }

    updateControls({ singlePost: !loadAll, postId });
}

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
 * @param {number} postId
 */
async function findOnePost(postId) {
    try {
        const response = await fetch(`${API_POSTS}/${postId}`);
        if (!response.ok) throw Error('Post not found');

        const post = await response.json();
        generatePost({ ...post, isSinglePost: true });

    } catch (error) {
        window.location.href = '/';
    }
}

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

async function removePost(postId) {
    try {
        await fetch(`${API_POSTS}/${postId}`, {
            method: 'DELETE',
        });

        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

/**
 * Generate post in DOM tree
 * @param {{
 *  id: number,
 *  title: string,
 *  desc: string,
 *  useLink: boolean,
 *  editor: boolean,
 *  isSinglePost: boolean,
 * }} - post and options
 */
function generatePost({ id, title, desc, useLink, editor, isSinglePost }) {
    const $posts = document.body.querySelector('#app .posts');
    if ($posts && !editor) {
        const $post = document.createElement(useLink ? 'a' : 'div');
        const $title = document.createElement(TITLE_TAG);
        const $desc = document.createElement(DESC_TAG);

        $post.classList.add('post');
        $post.id = `post-${id}`;

        if (useLink) {
            $post.href = `/?p=${id}`;
        }

        $title.classList.add('title');
        $title.innerHTML = title;

        $desc.classList.add('desc');
        $desc.innerHTML = desc;

        $post.appendChild($title);
        $post.appendChild($desc);
        $posts.appendChild($post);
    }

    if ($posts && editor) {
        const $firstPost = document.querySelector('#app .posts .post');
        const $editor = document.querySelector('#app .posts .editor');

        if (!$editor) {
            const $post = document.createElement('div');
            const $title = document.createElement('input');
            const $desc = document.createElement('textarea');
            const $buttons = document.createElement('div');
            const $close = document.createElement('span');
            const $submit = document.createElement('span');

            $post.classList.add('post', 'editor');

            $title.classList.add('title');
            $title.value = title || '';
            $title.placeholder = 'title';

            $desc.classList.add('desc');
            $desc.value = desc || '';
            $desc.placeholder = 'description';

            $buttons.classList.add('buttons');

            $close.classList.add('button', 'editor-button');
            $close.innerHTML = 'close';
            $close.addEventListener('click', () => window.location.reload());

            $submit.classList.add('button', 'editor-button');
            $submit.innerHTML = 'submit';
            $submit.addEventListener('click', async () => {
                if (isSinglePost) {
                    await updatePost({ id, title: $title.value, desc: $desc.value });
                } else {
                    await createPost({ title: $title.value, desc: $desc.value });
                }
            });

            $buttons.appendChild($close);
            $buttons.appendChild($submit);
            $post.appendChild($title);
            $post.appendChild($desc);
            $post.appendChild($buttons);
            $posts.insertBefore($post, $firstPost);
        }
    }
}

function updateControls({ singlePost, postId }) {
    const $left = document.querySelector('.controls .left');
    const $right = document.querySelector('.controls .right');

    if (!singlePost) {
        const $return = $left.querySelector('a');
        $return.remove();
    }

    if (singlePost) {
        const $post = document.querySelector('#app .post');
        const $create = $right.querySelector('.button');
        const $edit = document.createElement('div');
        const $remove = document.createElement('div');

        $edit.classList.add('button', 'edit');
        $edit.innerHTML = 'edit post';
        $edit.addEventListener('click', () => {
            generatePost({
                id: postId,
                title: $post.querySelector('.title').textContent,
                desc: $post.querySelector('.desc').textContent,
                isSinglePost: true,
                editor: true,
            });

            $post.remove();
        });

        $remove.classList.add('button', 'remove');
        $remove.innerHTML = 'remove post';
        $remove.addEventListener('click', () => {
            if (confirm('You are sure?')) {
                removePost(postId);
            }
        });

        $right.insertBefore($edit, $create);
        $right.insertBefore($remove, $edit);
        $create.remove();
    }
}

window.onload = boot;