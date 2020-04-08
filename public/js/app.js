/**
 * @async
 * @returns {void}
 */
async function boot() {
    const query = readWindowQuery();
    const hasId = isNaN(Number(query.p)) ? false : true;

    if (!hasId) {
        await findAllPosts();
    } else {
        await findOnePost(query.p);
    }

    updateControls({ singlePost: hasId, postId: query.p });
}

/**
 * @returns {{ [x:string]: string }} - objects from url parameter
 */
function readWindowQuery() {
    const rawQuery = window.location.search.replace('?', '');
    const queries = rawQuery.split('&');
    const result = {};

    for (const query of queries) {
        if (query.length > 0) {
            const [key, value] = query.split('=');
            result[key] = value;
        }
    }

    return result;
}

/**
 * Change state of controls in header
 * @param {{ isSinglePost: boolean, postId: number }} - state options
 * @returns {void}
 */
function updateControls({ singlePost, postId }) {
    const $left = document.querySelector('.controls .left');
    const $right = document.querySelector('.controls .right');

    if (!singlePost) {
        const $create = $right.querySelector('.createPost');
        $create.addEventListener('click', () => generateEditor());

        $left.querySelector('a').remove();
    }

    if (singlePost) {
        const $post = document.querySelector('#app .posts .post');
        const $create = $right.querySelector('.button');
        const $edit = createElement({
            tag: 'div',
            classList: ['button', 'edit'],
            content: 'edit post',
            event: {
                name: 'click',
                action: () => {
                    generateEditor({
                        id: postId,
                        title: $post.querySelector('.title').textContent,
                        desc: $post.querySelector('.desc').textContent,
                        isSinglePost: true,
                    });

                    $post.remove();
                },
            },
        });

        const $remove = createElement({
            tag: 'div',
            classList: ['button', 'remove'],
            content: 'remove post',
            event: {
                name: 'click',
                action: async () => confirm('You are sure?')
                    ? await removePost(postId)
                    : void 0,
            },
        })

        $right.insertBefore($edit, $create);
        $right.insertBefore($remove, $edit);
        $create.remove();
    }
}

window.onload = boot;