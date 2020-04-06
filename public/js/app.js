async function boot() {
    const [_, postId] = window.location.search.split('=');
    const hasId = isNaN(Number(postId)) ? false : true;

    if (!hasId) {
        await findAllPosts();
    } else {
        await findOnePost(postId);
    }

    updateControls({ singlePost: hasId, postId });
}

/**
 * Change state of controls in header
 * @param {{ isSinglePost: boolean, postId: number }} - state options 
 */
function updateControls({ singlePost, postId }) {
    const $left = document.querySelector('.controls .left');
    const $right = document.querySelector('.controls .right');

    if (!singlePost) {
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
        })

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